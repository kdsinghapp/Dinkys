import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Platform,
    Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLocation } from './LocationContext';
import GooglePlacesInput from './AutoAddress';
import MyStatusBar from '../../elements/MyStatusBar';
import HeaderTwo from '../../components/Header';
import localizationStrings from '../Localization/Localization';
import { DOMAIN } from '../../services/Config';
import { useSelector } from 'react-redux';

const GOOGLE_PLACES_API_KEY = 'AIzaSyCPO3jjHmxtN44lSqdaB278knxRvijkSR0' // Replace with your actual API key

const SelectLocation = () => {
    const [location, setLocation] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [nearbyLocations, setNearbyLocations] = useState([]);
    const [recentLocations, setRecentLocations] = useState([]);
    const [currentCoords, setCurrentCoords] = useState(null);
    const { setLocationName } = useLocation(); // Get the setLocationName function from context
    const navigation = useNavigation();
    
    const userDetailData = useSelector((state) => state.user.user)

    const isFocus = useIsFocused()

 

    useEffect(() => {
        const loadSavedAddresses = async () => {
            const saved = await AsyncStorage.getItem('savedAddresses');
            if (saved) {
                setSavedAddresses(JSON.parse(saved));
            }
        };

        loadSavedAddresses();

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setCurrentCoords({ latitude, longitude });
                fetchNearbyLocations(latitude, longitude);
            },
            error => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    const fetchNearbyLocations = async (latitude, longitude) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&key=${GOOGLE_PLACES_API_KEY}`;
            console.log('Fetching URL:', url);
    
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.error_message) {
                console.error('Google Places API Error:', data.error_message);
                return;
            }
    
            setNearbyLocations(data.results);
            
        } catch (error) {
            console.error('Fetch Nearby Locations Error:', error);
        }
    };
    

    const handleSaveAddress = useCallback(
        async (address) => {
            // Check if the address already exists in savedAddresses
            const existingAddress = savedAddresses.find(item => item.place_id === address.place_id);
            if (existingAddress) {
               errorToast('This address is already saved.');
               setLocationName(address?.name); // Set the location name in context
               navigation.goBack();
                return;
            }

            const updatedAddresses = [...savedAddresses, address];
            setSavedAddresses(updatedAddresses);
            await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
        
            setLocationName(address?.name); // Set the location name in context
            navigation.goBack();
        },
        [savedAddresses, setLocationName, navigation]
    );

    const handleSelectLocation = useCallback(
        (details) => {
            const { lat, lng } = details.geometry.location;
            _update_location(lat,lng)
            setLocation({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            const recent = [...recentLocations, details];
            setRecentLocations(recent);
            handleSaveAddress(details); // Save the selected address
            setLocationName(details.name); // Set the location name in context
            navigation.goBack();
        },
        [recentLocations, handleSaveAddress, setLocationName, navigation]
    );

    const renderLocationItem = useCallback(({ item }) => {
        const distance = currentCoords
            ? getDistance(currentCoords, {
                latitude: item.geometry.location.lat,
                longitude: item.geometry.location.lng,
            })
            : 0;

        const formattedDistance = distance < 1000
            ? `${distance} m`
            : `${(distance / 1000).toFixed(2)} km`;

        return (
            <TouchableOpacity
                onPress={() => handleSaveAddress(item)}
                style={styles.locationItem}
            >
                <View>
                <Image  source={require('../../assets/location.png')}  style={{height:15,width:15,tintColor:'#0BD89E'}}/>
                    <Text style={{ fontSize: 10, color: '#000', marginTop: 5 }}>{formattedDistance}</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.locationName}>{item.name}</Text>
                    <Text style={styles.locationAddress}>{item.vicinity}</Text>
                </View>
            </TouchableOpacity>
        );
    }, [currentCoords]);


    const _update_location = (lat,long) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
        const formData = new FormData();
        formData.append("user_id",userDetailData?.id); // Replace with the actual user_id
    
        formData.append("lat", lat); // Replace with the actual user_id
    
        formData.append("lon",long); // Replace with the actual user_id
    
        const requestOptions = {
            method: "POST", // Change to POST since you're sending form data
            headers: myHeaders,
            body: formData,
            redirect: "follow",
        };
    
        fetch(`${DOMAIN}update-profile`, requestOptions)
    
        .then((resText) => {
          //  console.log("Response text:", resText);
            // Parse JSON manually if the response is valid JSON
            console.log("update-profile =>>>>>>>>>>> ", resText.status);
            try {
              0
                console.log("update-profile =>>>>>>>>>>> ", resText.status);
                if (resText.status == "200") {
                    console.log('Updated successfully:', resText.status);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        })
        .catch((err) => {
            console.log("Error:", err);
        });
    };
    return (
     
        <View style={styles.container}>
           
        <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
        <HeaderTwo navigation={navigation} title={localizationStrings.select_location} />
       
            <View style={{ width: '100%', marginTop: 10, 
       
           }}>
                <GooglePlacesInput placeholder={localizationStrings.search_location}   onPlaceSelected={handleSelectLocation} />
            </View>
            <View style={styles.savedContainer}>
                <Text style={styles.sectionTitle}>{localizationStrings.save_address}</Text>
                <FlatList
                    data={savedAddresses}
                    renderItem={renderLocationItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

            <View style={styles.nearbyContainer}>
                <Text style={[styles.sectionTitle, { fontSize: 16, fontWeight: '400', fontFamily: 'Federo-Regular', }]}>{localizationStrings.near_Location}</Text>
               {nearbyLocations && <FlatList
                    data={nearbyLocations} // Show only the first 3 nearby locations
                    renderItem={renderLocationItem}
                    keyExtractor={(item, index) => index.toString()}
                />}
                {nearbyLocations == null &&
                <ActivityIndicator size={20} />

                }
            </View>

            <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={() => {
                    Geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;

                            _update_location(latitude, longitude)
                            setLocation({
                                latitude,
                                longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            });
                            setCurrentCoords({ latitude, longitude });
                            fetchNearbyLocations(latitude, longitude);
                        },
                        error => {
                            console.log(error);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                }}
            >
            <Image  source={require('../../assets/location.png')}  style={{height:30,width:30,tintColor:'#fff'}}/>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
     
        backgroundColor: '#fff',
    },
    savedContainer: {
        marginVertical: 10,
     
    },
    nearbyContainer: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        marginHorizontal: 15,
        color:'#000',
        marginVertical: 10,
        fontFamily: 'Federo-Regular',
    },
    locationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 14,
        color: '#555',
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#0BD89E',
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SelectLocation;
