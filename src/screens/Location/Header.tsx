import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Pin from '../assets/svg/Pin.svg';
import Down from '../assets/svg/Down.svg';
import Msg from '../assets/svg/Msg.svg';
import Bell from '../assets/svg/Bell.svg';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';
import localizationStrings from '../utils/Localization';
import { useLocation } from './LocationContext'; // Import the useLocation hook
import { getCurrentLocation, locationPermission } from './helperFunction'; // Import your location helper functions

const Header = () => {
    const { locationName, setLocationName } = useLocation(); // Get locationName and setLocationName from context
    const navigation = useNavigation();

    useEffect(() => {
        // Fetch live location and update locationName
        const fetchLiveLocation = async () => {
            const locPermissionDenied = await locationPermission();
            if (locPermissionDenied) {
                const { latitude, longitude } = await getCurrentLocation();
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
                try {
                    const res = await fetch(url);
                    const json = await res.json();
                    const city = findCityName(json);
                    setLocationName(city);
                } catch (e) {
                    console.log("Error fetching location:", e);
                }
            }
        };

        fetchLiveLocation();
    }, []);

    function findCityName(response) {
        const results = response.results;
        for (let i = 0; i < results.length; i++) {
            const addressComponents = results[i].address_components;
            for (let j = 0; j < addressComponents.length; j++) {
                const types = addressComponents[j].types;
                if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                    return addressComponents[j].long_name; // Return the city name
                }
            }
        }
        return null; // Return null if city name not found
    }

    return (
        <View style={styles.container}>


            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(ScreenNameEnum.SelectLocation);
                }}
                style={styles.locationButton}
            >
                <Text style={styles.locationText}>{localizationStrings.current_location}</Text>
                <View style={styles.locationContainer}>
                    <Pin />
                    <Text style={styles.locationName}>{locationName ? locationName.substring(0, 15) : 'Localisation..'}</Text>
                    <Down />
                </View>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(ScreenNameEnum.CHAT_CONTACT_SCREEN);
                    }}
                >
                    <Msg />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(ScreenNameEnum.MsgNotification);
                    }}
                >
                    <Bell />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {


        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,

    },
    locationButton: {

        alignItems: 'center',
    },
    locationText: {
        fontFamily: 'Federo-Regular',
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        marginLeft: -15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    locationName: {
        fontFamily: 'Federo-Regular',
        fontSize: 12,

        fontWeight: '500',
        color: '#000',
        marginHorizontal: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        width: '25%',
        justifyContent: 'space-between',
    },
});

export default Header;
