import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import HeaderTwo from './Header';
import Theme from '../theme';
import { useNavigation } from '@react-navigation/native';
import { getCurrentLocation, locationPermission } from './helperFunction';
import AddressAutocomplete from './AddressAutocomplete'; // Import the new component
import { hp, width, wp } from '../utils/Constant';
import localizationStrings from '../screens/Localization/Localization';

Geocoder.init("AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70");

const MyaddressModal = ({ sendLocation, setLocationName, modalVisible, setModalVisible }) => {
    const [nearbyLocations, setNearbyLocations] = useState([]);

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
    const [mapPointerEvents, setMapPointerEvents] = useState('auto');
    const navigation = useNavigation();


    // Ask for permission and get location on component mount
    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        const locPermissionDenied = await locationPermission();
        if (locPermissionDenied === 'granted') {
            const { latitude, longitude } = await getCurrentLocation();
            setMarkerPosition({ latitude, longitude });
            setRegion({
                ...region,
                latitude,
                longitude
            });
            reverseGeocode(latitude, longitude);
        }
    };

    // Reverse geocoding to get the address from lat/lng
    const reverseGeocode = (latitude, longitude) => {
        Geocoder.from(latitude, longitude)
            .then(json => {
                const addressComponent = json.results[0].formatted_address;
                setAddress(addressComponent);
                setLocationName(addressComponent);
                fetchNearbyLocations(latitude, longitude);
            })
            .catch(error => console.warn(error));
    };
    const fetchNearbyLocations = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70`
            );
            const data = await response.json();
            if (data.results) {
                setNearbyLocations(data.results);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleConfirmLocation = () => {
        setModalVisible(false); // Close modal when user confirms location
    };

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
                <View style={{ alignSelf: 'center', position: 'absolute', width: wp(100), alignItems: 'center', marginTop: 10 }}>
                    <AddressAutocomplete
                        setMarkerPosition={setMarkerPosition}

                        setRegion={setRegion}
                        setAddress={setAddress}
                        setLocationName={setLocationName}
                        sendLocation={sendLocation}
                        onFocus={() => setMapPointerEvents('none')}
                        onBlur={() => setMapPointerEvents('auto')}
                    />
                </View>

                {/* Display nearby locations */}
                <Text style={{ fontWeight: '600', color: '#000', fontSize: 18, marginTop: '25%' }}>{localizationStrings.near_Location}</Text>

                <View style={{ flex: 1, marginTop: 20 }}>
                    {nearbyLocations?.length > 0 && (
                        <FlatList
                            data={nearbyLocations}
                            keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.locationItem, { borderColor: address == item?.vicinity ? 'green' : '#fff', borderWidth: address == item?.vicinity ? 1 : 0, borderRadius: 15, paddingHorizontal: 10 }]}
                                    onPress={() => {
                                        setLocationName(item?.name);
                                        sendLocation({
                                            latitude: item.geometry.location.lat,
                                            longitude: item.geometry.location.lng,
                                        })
                                        setAddress(item?.vicinity); // or another property you want to display
                                        setMarkerPosition({
                                            latitude: item.geometry.location.lat,
                                            longitude: item.geometry.location.lng,
                                        });


                                    }}
                                >
                                    <Text style={{ color: '#000', fontWeight: '600', fontSize: 14 }}>{item?.name}</Text>
                                    <Text style={[styles.locationVicinity, { color: '#000', }]}>{item?.vicinity}</Text>
                                </TouchableOpacity>
                            )}

                            ListFooterComponent={({item})=>(
                                <View  style={{height:hp(14)}} />
                            )}
                        />
                    )}
                </View>




                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                    <Text style={styles.confirmButtonText}>{localizationStrings.C_location}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default MyaddressModal;

const styles = StyleSheet.create({
    nearbyLocationsContainer: {
        width: '90%',
        maxHeight: '50%',
        marginBottom: 20,
        position: 'absolute',
        top: '30%', // Adjust as needed
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 5,
    },
    locationItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',

    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationVicinity: {
        fontSize: 14,
        color: '#555',
    },
    modalContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    addressContainer: {
        backgroundColor: 'white',
        width: '90%',
        padding: 10,
        borderRadius: 8,
        elevation: 5,
        marginBottom: 20,
        position: 'absolute',
        top: '20%',
    },
    addressText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: Theme.BUTTON_PRIMARY_COLOR,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        marginBottom: 30,
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
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
        marginTop: -15
    },
});
