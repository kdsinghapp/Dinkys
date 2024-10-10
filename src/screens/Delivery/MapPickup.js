import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Back from '../../assets/svg/Back.svg';
import Ratting from './Ratting';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { DOMAIN } from '../../services/Config';
import { successToast } from '../../utils/customToast';
import { getCurrentLocation } from '../../components/helperFunction';
import { useDispatch, useSelector } from 'react-redux';
// Replace with your Google Maps API key
const GOOGLE_MAPS_APIKEY = 'AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70';

export default function MapPickup() {
  const [loading, setLoading] = useState(false)
  const mapRef = useRef(null);
  const route = useRoute();
  const { order, item, sellerData, userData } = route.params; // Destination info
  const CarImage = require('../../assets/dinkyimg/Car2x.png')
const dispatch = useDispatch()
  const [dgree, setdgree] = useState(140)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 22.6856909,
    longitude: 75.873121,
  });
  const [startTime, setStartTime] = useState(Date.now());
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const userDetailData = useSelector((state) => state.user.user)
  const [user, setUser] = useState(null)


  useEffect(() => {


    const intervalId = setInterval(() => {
      setdgree(getRandomNumber(90, 200))
    }, 3000); // 10000 milliseconds = 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  const [destinationLocation, setDestinationLocation] = useState({
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.long),
    // latitude: 22.7027441,
    // longitude: 75.8706341,

  })
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateCamera({
        center: currentLocation,
        zoom: 19,
      });
    }
  }, [currentLocation]);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {

      _get_profile()

    }, [])
  )
  const _get_profile = () => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    fetch(`${DOMAIN}get-profile`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.status == "1") {
          dispatch({ type: "WALLET", payload: res?.data?.wallet });
          setUser(res?.data)

        }
      }).catch((err) => {
        console.log("err", err)
      })
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destinationLocation.latitude},${destinationLocation.longitude}`;
    Linking.openURL(url);
  };

  const makePhoneCall = (Number) => {

    try {
      RNImmediatePhoneCall.immediatePhoneCall(Number);
    }
    catch (err) {
      console.log(err);
    }
  }

  // useEffect(() => {

  //   getLocation()
  // }, []);

  // const getLocation = async () => {
  //   const currentLocation2 = await getCurrentLocation();

  //   setCurrentLocation({ latitude: currentLocation2.latitude, longitude: currentLocation2.longitude })
  // }
  // useEffect(() => {

  //   // Set an interval to update the user's location every 8 seconds
  //   const locationInterval = setInterval(async () => {

  //     getLocation()



  //   }, 8000);

  //   // Clean up the interval on component unmount
  //   return () => clearInterval(locationInterval);

  // }, [])


  const _pickupOrder = async (status) => {
    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    var formdata = new FormData();

    formdata.append("order_id", order?.order_id);
    formdata.append("status", status);
   formdata.append("user_id", user?.id);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    await fetch(`${DOMAIN}changeOrderStatus`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.status == "1") {
          setLoading(false)
          successToast('Product Successfully Picked up')
          navigation.navigate('MapDeliverd', { item, sellerData, userData, order });
        }
        else { errorToast(res.message) }
      }).catch((err) => {
        console.log("err", err)
        setLoading(false)
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        ref={mapRef}
        cameraZoomRange={5}
        region={{
          latitude: 22.6856909,
          longitude: 75.873121,
        
          // latitude: currentLocation.latitude || destinationLocation.latitude,
          // longitude: currentLocation.longitude || destinationLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
          
        }}
      
      >
        {currentLocation.latitude !== 0 && (
          <>

            <Marker coordinate={currentLocation}>
              <View style={[styles.marker, { transform: [{ rotate: `${dgree}deg` }], }]}>
                <Image
                  source={CarImage}
                  style={styles.markerImage}

                />
              </View>
            </Marker>

            {/* Destination marker */}
            <Marker
              coordinate={destinationLocation}
              title="Destination"
              pinColor="green"
         

              style={{height:40,width:40}}
            >
               <View style={[styles.marker, { transform: [{ rotate: `${dgree}deg` }], }]}>
                <Image
                  source={require('../../assets/dinkyimg/parcel.png')}
                  style={styles.markerImage}

                />
              </View>
            </Marker>

            {/* Draw route between current location and destination */}
            <MapViewDirections
              origin={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
              }}
              destination={destinationLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="#7aa7f0"
            />
          </>
        )}
      </MapView>
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: '#FFF',
            padding: 5,
            borderRadius: 10,
            marginHorizontal: 5,
            marginVertical: 5,
            position: 'absolute',
            width: '90%',
            bottom:100,
            alignSelf: 'center'
          },
        ]}>
        <View
          style={{
            paddingVertical: 5,
            borderColor: 'rgba(31, 29, 26, 0.14)',
            borderBottomWidth: 1,
          }}>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginTop: 10,
            }}>

            <View style={{ width: '85%' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 18,
                  color: '#1F1D1A',
                }}>
                {sellerData?.user_name}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#000',
                  fontWeight: '400',
                  lineHeight: 18,
                }}>
                {sellerData?.address}
              </Text>

            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '35%',
                position: 'absolute',
                right: 0,
                top: -5,
                justifyContent: 'space-between',
                alignItems: 'center',

              }}>
              <Ratting Ratting={sellerData?.rating} />

              <Text
                style={{
                  fontSize: 10,
                  color: '#000',
                  fontWeight: '700',
                  lineHeight: 14,

                }}>
                {sellerData?.rating}
              </Text>
            </View>
          </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <View>
            <Image
              source={{ uri: item?.product_images[0].image }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,

              }}
              resizeMode="cover"
            />
          </View>
          <View style={{ width: '60%', marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                lineHeight: 18,
                color: '#1F1D1A',
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#000',
                fontWeight: '400',
                lineHeight: 18,
              }}>
              {item.product_location}
            </Text>

          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 18,
                color: '#1F1D1A',
              }}>
              £ {item.price}
            </Text>

          </View>

        </View>
      </View>
      <TouchableOpacity

        onPress={() => {
          openGoogleMaps()
        }}
        style={{
          position: 'absolute', top: hp(57), right: 20, backgroundColor: '#fab520',

          borderRadius: 25, height: 50, width: 50, alignItems: 'center', justifyContent: 'center'
        }}>
        <Image source={require('../../assets/dinkyimg/black-pointer.png')} style={{ height: 30, width: 30 }} resizeMode='contain' />
      </TouchableOpacity>
      <TouchableOpacity

        onPress={() => {
          makePhoneCall(sellerData?.mobile)
        }}
        style={{
          position: 'absolute', top: hp(65), right: 20,

          borderRadius: 25, height: 50, width: 50, alignItems: 'center', justifyContent: 'center'
        }}>
        <Image source={require('../../assets/dinkyimg/call2.png')} style={{ height: 60, width: 60 }} resizeMode='cover' />
      </TouchableOpacity>



      <View
        style={{
          height: hp(5),
          justifyContent: 'center',
          paddingHorizontal: 20,
          marginTop: 20,
          position: 'absolute',
          top: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Back />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          _pickupOrder('Pickuped')

        }}
        style={styles.continueButton}
      >
        {loading ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={styles.continueButtonText}>Pickup from seller</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    height: 55,
    backgroundColor: '#0BD89E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    width: '95%',
    alignSelf: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
  },
  markerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
