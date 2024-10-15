

// AddressAutocomplete.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddressAutocomplete = ({ setMarkerPosition, setRegion, setAddress, setLocationName, sendLocation, onFocus, onBlur }) => {
    return (
        <GooglePlacesAutocomplete
        placeholder="Search for an address"
        fetchDetails={true}
        onPress={(data, details = null) => {
            if (details) {
                const { lat, lng } = details.geometry.location;
                setMarkerPosition({
                    latitude: lat,
                    longitude: lng,
                });
                setRegion(prevRegion => ({
                    ...prevRegion,
                    latitude: lat,
                    longitude: lng,
                }));
                setAddress(details.formatted_address);
                setLocationName(details.formatted_address);
                sendLocation({ latitude: lat, longitude: lng });
            }
        }}
        textInputProps={{
            placeholderTextColor: "#000"
        }}
        enablePoweredByContainer={false}
        query={{
            key: 'AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70',
            language: 'en',
        }}
        styles={{
            description: {
                fontWeight: 'bold',
                color: 'black',
                width: '90%',
            },
            textInput: {
                fontSize: 13,
                color: '#000',
                height: '100%',
                width: '90%',
                borderWidth: 1,
                borderRadius: 10,
                paddingVertical: 10,
                borderColor: '#ccc',
            },
            container: {
                position: 'absolute',
                width: '90%',
                top: 80,
                zIndex: 2, // Ensure the autocomplete is on top
            },
            listView: {
                backgroundColor: 'white',
                zIndex: 3, // Ensure the list is on top of everything
            },
        }}
        listViewDisplayed="auto"
        onFocus={onFocus}
        onBlur={onBlur}
    />
);
};



export default AddressAutocomplete;
