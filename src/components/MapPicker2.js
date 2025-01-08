import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import HeaderTwo from './Header';
import Theme from '../theme';
import { useNavigation } from '@react-navigation/native';
import localizationStrings from '../screens/Localization/Localization';

const MapPickerModal2 = ({ sendLocation, setLocationName, modalVisible, setModalVisible }) => {
    const [region, setRegion] = useState({
        latitude: 22.6845605,
        longitude: 75.8618508,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 22.6845605,
        longitude: 75.8618508,
    });
    const [pickupPoints, setPickupPoints] = useState([]);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const navigation = useNavigation();

    const fetchPickupPoints = async () => {
        try {
            const response = await fetch("https://panel.dkyss.es/api/get-pickup-points-near-by", {
                method: "POST",
                redirect: "follow",
            });
            const result = await response.json();
            if (result.status === 1) {
                setPickupPoints(result.data);
            } else {
                Alert.alert("Error", "Failed to fetch pickup points.");
            }
        } catch (error) {
            console.error("Error fetching pickup points:", error);
        }
    };

    const getCurrentLocation = () => {
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
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    useEffect(() => {
        getCurrentLocation();
        fetchPickupPoints();
    }, []);

    const handleMarkerPress = (location) => {
        setSelectedMarkerId(location.id);
        sendLocation({ latitude: parseFloat(location.lat), longitude: parseFloat(location.long) });
        setLocationName(location.location);
    };

    const handleConfirmLocation = () => {
        if (!selectedMarkerId) {
            Alert.alert("Select a location", "Please select a location before confirming.");
            return;
        }
        setModalVisible(false);
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <HeaderTwo navigation={navigation} title={localizationStrings.Select_address} />
                </View>

                <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                >
                    {pickupPoints.map((point) => (
                        <Marker
                            key={point.id}
                            coordinate={{
                                latitude: parseFloat(point.lat),
                                longitude: parseFloat(point.long),
                            }}
                            title={point.location}
                            pinColor={selectedMarkerId === point.id ? 'green' : 'red'}
                            onPress={() => handleMarkerPress(point)}
                        />
                    ))}
                </MapView>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmLocation}
                >
                    <Text style={styles.confirmButtonText}>{localizationStrings.C_location}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default MapPickerModal2;

const styles = StyleSheet.create({
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
        paddingHorizontal: 15,
    },
});
