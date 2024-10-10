import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import HeaderTwo from './Header';
import Theme from '../theme';
import { useNavigation } from '@react-navigation/native';
import { getCurrentLocation, locationPermission } from './helperFunction';
import AddressAutocomplete from './AddressAutocomplete'; // Import the new component
import { width } from '../utils/Constant';

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
  

    console.log('nearbyLocations',nearbyLocations[0]?.name);
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)} // Handle back button on Android
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <HeaderTwo navigation={navigation} title={"Select Address"} />
                </View>
                <View style={{ alignSelf:'center',position:'absolute',width:'100%' }}>
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
                <Text style={{ fontWeight: '600', color: '#000', fontSize: 18, marginTop: '25%' }}>Near By Locations</Text>
    
                <View style={{ flex: 1 }}>
    {nearbyLocations?.length > 0 && (
        <FlatList
            data={nearbyLocations}
            keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => {
                        setLocationName(item?.name);
                        setAddress(item?.vicinity); // or another property you want to display
                        setMarkerPosition({
                            latitude: item.geometry.location.lat,
                            longitude: item.geometry.location.lng,
                        });
                    }}
                >
                    <Text style={styles.locationText}>{item?.name}</Text>
                    <Text style={styles.locationVicinity}>{item?.vicinity}</Text>
                </TouchableOpacity>
            )}
        />
    )}
</View>




                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                    <Text style={styles.confirmButtonText}>Confirm Location</Text>
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
        paddingHorizontal:20,
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
        alignSelf:'center'
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
    },
});
