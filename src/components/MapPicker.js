import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, Pressable, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding'; // Optional if you want address from lat/lng
import HeaderTwo from './Header';
import Theme from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCurrentLocation, locationPermission } from './helperFunction';
import Geolocation from '@react-native-community/geolocation';
import AddressAutocomplete from './AddressAutocomplete';
import localizationStrings from '../screens/Localization/Localization';

Geocoder.init('AIzaSyCPO3jjHmxtN44lSqdaB278knxRvijkSR0');


const MapPickerModal = ({ sendLocation, setLocationName, modalVisible, setModalVisible }) => {
    const [region, setRegion] = useState({
        latitude: 22.6996933,
        longitude: 75.8569801,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 22.6996933,
        longitude: 75.8569801,
    });
    const [address, setAddress] = useState('');
    const [placeholderModal, setplaceholderModal] = useState(false);
    const navigation = useNavigation();


    const getCurrentLocation2 = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setRegion({
                    ...region,
                    latitude,
                    longitude,
                });
                setMarkerPosition({
                    latitude,
                    longitude,
                });
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // // Ask for permission and get location on component mount
    useEffect(() => {
        getCurrentLocation2();
    }, []);




    const handleConfirmLocation = () => {

        setModalVisible(false); // Close modal when user confirms location
    };

    // setAddress(details.formatted_address);
    // setLocationName(details.formatted_address);
    // sendLocation({ latitude: lat, longitude: lng });


    const setLocaitonName = (liveLocation) => {
        sendLocation({ latitude: liveLocation?.latitude, longitude: liveLocation.longitude });
        if (liveLocation?.latitude && liveLocation?.longitude) {
            Geocoder.from(liveLocation.latitude, liveLocation.longitude)
                .then(json => {
                    const addressComponent = json.results[0]?.formatted_address;
                    if (addressComponent) {
                        setLocationName(addressComponent);
                        setAddress(addressComponent)
                    }
                })
                .catch(error => console.warn(error));
        } else {
            setPlaceholderText("Search for an address");
        }
    }
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)} // Handle back button on Android
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <HeaderTwo navigation={navigation} title={localizationStrings.Select_address} />
                </View>



                {placeholderModal &&
                    <AddressAutocomplete
                        setMarkerPosition={(latitude, longitude) => {

                            console.log('latitude, longitude', latitude, longitude);

                            sendLocation({ latitude: latitude, longitude: longitude });
                            setMarkerPosition({
                                latitude,
                                longitude,
                            })
                            setplaceholderModal(false)
                        }}
                        setRegion={setRegion}
                        setAddress={setAddress}
                        setLocationName={setLocationName}
                        sendLocation={sendLocation}
                        onFocus={() => setMapPointerEvents('none')}
                        onBlur={() => setMapPointerEvents('auto')}
                        liveLocation={markerPosition}
                    />}

                <Pressable
                    onPress={() => {
                        setplaceholderModal(true)
                    }}
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, width: '90%',
                        height: 60,
                        paddingHorizontal: 10,

                        zIndex: 1,
                        marginTop: '20%'
                    }}>

                    <Text style={{ color: '#000', fontSize: 12, fontWeight: '500', }}>{address ? address?.substring(0, 60) : 'Enter address'}</Text>

                </Pressable>

                {!placeholderModal && <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={(newRegion) => {
                        setLocaitonName(newRegion)
                        setMarkerPosition({
                            latitude: newRegion.latitude,
                            longitude: newRegion.longitude,
                        });
                        setRegion(newRegion); // Save the new region
                    }}
                />}

                {!placeholderModal && <View style={styles.markerFixed}>
                    <Image source={require('../assets/locationpin.png')} style={{ height: 40, width: 40 }} />
                </View>
                }
                {!placeholderModal &&
                    <TouchableOpacity
                        style={{
                            position: 'absolute', bottom: 150, right: 30,
                            height: 40, width: 40, alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#919b9d', borderRadius: 15
                        }}
                        onPress={getCurrentLocation2}
                    >
                        <Image source={require('../assets/target.png')} style={{ height: 25, width: 25 }} />
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                    <Text style={styles.confirmButtonText}>{localizationStrings.C_location}</Text>
                </TouchableOpacity>


            </View>
        </Modal>
    );
};

export default MapPickerModal;

const styles = StyleSheet.create({
    markerFixed: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -12,
        marginTop: -48,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',

    },
    confirmButton: {
        backgroundColor: Theme.BUTTON_PRIMARY_COLOR,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        marginBottom: 30,
        elevation: 5,
        position: 'absolute',
        bottom: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerContainer: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: -25,
        paddingHorizontal: 15
    },
});

