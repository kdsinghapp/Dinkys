import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import Geocoder from 'react-native-geocoding';
import HeaderTwo from './Header';
import Theme from '../theme';
import { useNavigation } from '@react-navigation/native';
import { getCurrentLocation, locationPermission } from './helperFunction';
import AddressAutocomplete from './AddressAutocomplete'; // Import the new component
import MapView, { Marker } from 'react-native-maps';

// Initialize Geocoder
Geocoder.init("AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70");

const PlaceHolderModal = ({  modalVisible, setModalVisible }) => {
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
            setRegion({ ...region, latitude, longitude });
            reverseGeocode(latitude, longitude);
        }
    };

    // Reverse geocoding to get the address from lat/lng
    const reverseGeocode = (latitude, longitude) => {
        Geocoder.from(latitude, longitude)
            .then(json => {
                const addressComponent = json.results[0]?.formatted_address;
                setAddress(addressComponent);
                setLocationName(addressComponent);
            })
            .catch(error => console.warn(error));
    };

    // Handle marker drag and drop
    const handleDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarkerPosition({ latitude, longitude });
        sendLocation({ latitude, longitude });
        reverseGeocode(latitude, longitude);
    };

    const handleConfirmLocation = () => {
        setModalVisible(false); // Close modal when user confirms location
    };

    const setLocationName = (liveLocation) => {
        sendLocation({ latitude: liveLocation?.latitude, longitude: liveLocation?.longitude });
        if (liveLocation?.latitude && liveLocation?.longitude) {
            Geocoder.from(liveLocation.latitude, liveLocation.longitude)
                .then(json => {
                    const addressComponent = json.results[0]?.formatted_address;
                    if (addressComponent) {
                        setLocationName(addressComponent);
                    }
                })
                .catch(error => console.warn(error));
        } else {
            setAddress("Search for an address");
        }
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)} // Handle back button on Android
        >
            <View style={styles.modalContainer}>
         


     
                <AddressAutocomplete
                    setMarkerPosition={setMarkerPosition}
                    setRegion={setRegion}
                    setAddress={setAddress}
                    setLocationName={(txt)=>{setLocationName(txt),setModalVisible(false)}}
                  //  sendLocation={sendLocation}
                    onFocus={() => setMapPointerEvents('none')} // Disable map touch when focused
                    onBlur={() => setMapPointerEvents('auto')} // Enable map touch when blurred
                />

             
            </View>
        </Modal>
    );
};

export default PlaceHolderModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(100, 100, 100, 0.5)',
  
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
        bottom: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
