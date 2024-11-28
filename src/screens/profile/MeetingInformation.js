import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, Linking, PermissionsAndroid, Platform, FlatList, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import HeaderTwo from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { errorToast, successToast } from '../../utils/customToast';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import ChatIcon from "../../assets/svg/chaticon.svg"
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { wp } from '../../utils/Constant';
const { width } = Dimensions.get('window');

const MeetingInforMation = () => {
  const navigation = useNavigation()
  const userDetails = useSelector((state) => state?.user?.user)
  const route = useRoute()
  const [currentLocation, setCurrentLocation] = useState(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const [activeIndex, setActiveIndex] = useState(0); // State to track the active index
  const [loading, setloading] = useState(false)
  const [loader, setloder] = useState('')
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });
  useEffect(() => {
    // Get the current location
    requestCallPermission()
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);
  const { item } = route.params
  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);

    // Format the date like "14 October 2024-Monday"
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });

    // Format the time like "7:26pm"
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return {
      date: formattedDate,
      time: formattedTime
    };
  };


  const dateArray = item?.date_time.split(',');

  // Format each date
  const formattedDates = dateArray.map(date => formatDateAndTime(date));

  const openGoogleMaps = () => {

    if (!item?.lat || !item?.long) return errorToast('No Address Found')
    if (currentLocation) {
      const { latitude, longitude } = currentLocation;
      const destination = '28.6139,77.2090'; // Replace with destination coordinates (e.g., Delhi)

      const url = Platform.select({
        ios: `maps://app?saddr=${latitude},${longitude}&daddr=${item?.lat},${item?.long}`,
        android: `google.navigation:q=${destination}`
      });

      Linking.openURL(url)
        .then(() => console.log('Google Maps opened'))
        .catch(err => console.error('Error:', err));
    }
  };
  const requestCallPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: "Call Phone Permission",
            message: "This app needs access to your phone to make a call",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the phone");
        } else {
          console.log("Call Phone permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const makePhoneCall = (Number) => {

    try {
      RNImmediatePhoneCall.immediatePhoneCall(Number);
    }
    catch (err) {
      console.log(err);
    }
  }


  const change_metting_status = (status, id) => {
    setloder(status)
    console.log('status', status, id);
    setloading(true)
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("status", status);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://panel.dkyss.es/api/change_meeting_status", requestOptions)
      .then((response) => response.text())
      .then((result) => {

        const res = JSON.parse(result)

        if (res?.status == '1') {

          const timer = setTimeout(() => {
            setloading(false)
            setloder('')
            successToast(res?.message)
            navigation.goBack()
          }, 3000); // 4000 milliseconds = 4 seconds

          // Clean up the timeout if the component unmounts
          return () => clearTimeout(timer);

        }
        else {
          errorToast(res?.message)
          setloading(false)
        }

      })
      .catch((error) => {

        setloading(false)
        console.error(error)
      }
      );
  }



  return (
    <View style={styles.container}>
      <HeaderTwo navigation={navigation} title={"Meeting Details"} />

      <View style={{ backgroundColor: '#5B2C83', flex: 1, padding: 20, }}>
        <ScrollView showsVerticalScrollIndicator={false}>



          <Text style={[, {
            fontSize: 16, backgroundColor: '#0BD89E', borderRadius: 10, color: '#fff',
            alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, width: '45%', paddingVertical: 5, alignSelf: 'flex-end',
            fontWeight: '600'
          }]}>Status : {item?.status}</Text>

          <Text style={styles.title}>Meeting with {item?.product_owner?.user_name ? item?.product_owner?.user_name : item?.organizer?.user_name}</Text>
          <Text style={styles.subTitle}>Need to discuss all details about the upcoming project together.</Text>
          <Text style={styles.title}>Product Details</Text>

          <FlatList
            data={item?.product?.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image }}
                style={{
                  width: wp(80), // Full width of the screen for each image
                  height: hp(20),
                  marginLeft: 10,
                  borderRadius: 20

                }}
                resizeMode='cover'
              />
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            {item?.product?.images?.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: index === activeIndex ? 'green' : 'gray',
                  margin: 5,
                }}
              />
            ))}
          </View>
          <View style={[styles.generalInfo, { marginTop: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>Name :</Text>
              <Text style={[styles.infoText, { marginLeft: 10 }]}>{item?.product?.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>Price</Text>
              <Text style={[styles.infoText, { marginLeft: 10 }]}>€ {item?.product?.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>Description : </Text>
              <Text style={[styles.infoText, { marginLeft: 10, fontSize: 10 }]}>{item?.product?.description}</Text>
            </View>

            {item?.organizer ? item?.organizer?.id : item?.product_owner.id != userDetails?.id && <Pressable
              style={{ position: 'absolute', right: 10 }}
              onPress={() => item == null ? null : navigation.navigate("ChattingScreen", {
                item: {
                  image: item?.organizer ? item?.organizer?.image : item?.product_owner.image,
                  name: item?.organizer ? item?.organizer?.user_name : item?.product_owner.user_name,
                  product_id: item?.product?.id,
                  reciever_id: item?.organizer ? item?.organizer?.id : item?.product_owner.id,
                },

              })}>
              <ChatIcon width={65} height={65} />
            </Pressable>}

          </View>

          <Text style={styles.title}>Meeting Details</Text>

          <View style={styles.generalInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 15 }}>

              <Text style={styles.infoText}>📍</Text>
              <Text style={[styles.infoText, { marginLeft: 10, width: '70%', fontSize: 12, }]}>{item?.location}</Text>

              <Pressable
                onPress={() => {
                  openGoogleMaps()
                }}
                style={{ position: 'absolute', right: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Image

                  source={require('../../assets/library.png')}
                  style={{ height: 30, width: 30 }}
                />
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 10 }}>Open map</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>📅</Text>
              <Text style={[styles.infoText, { marginLeft: 10 }]}>{formattedDates[0]?.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>🕒</Text>
              <Text style={[styles.infoText, { marginLeft: 10 }]}>{formattedDates[0]?.time}</Text>
            </View>

          </View>




          <Text style={styles.title}>Amount</Text>
          <View style={styles.generalInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>Paid Amount : </Text>
              <Text style={[styles.infoText, { marginLeft: 10 }]}>€ {item?.price_offer}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

              <Text style={styles.infoText}>Product Price: </Text>
              <Text style={[styles.infoText, { marginLeft: 10 }]}>€ {item?.product?.price}</Text>
            </View>


          </View>
          <Text style={styles.title}>{item?.organizer?.user_name ? 'Organizer Details' : 'Product Owner Details'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Image source={{ uri: item?.organizer ? item?.organizer?.image : item?.product_owner.image }} style={{ height: 60, width: 60, borderRadius: 30 }} />
            <View style={{ marginLeft: 20, marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                <Text style={styles.infoText}>Name :</Text>
                <Text style={[styles.infoText, { marginLeft: 10 }]}>{item?.organizer ? item?.organizer?.user_name : item?.product_owner.user_name}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                <Text style={styles.infoText}>Mobile :</Text>
                <Text style={[styles.infoText, { marginLeft: 10 }]}>{item?.organizer ? item?.organizer?.mobile : item?.product_owner.mobile}</Text>
              </View>



            </View>
            {item?.status !== 'Completed' &&
              <TouchableOpacity

                onPress={() => {
                  makePhoneCall(item?.organizer ? item?.organizer?.mobile : item?.product_owner.mobile)
                }}
                style={{
                  position: 'absolute', right: 10,

                  borderRadius: 25, height: 50, width: 50, alignItems: 'center', justifyContent: 'center'
                }}>
                <Image source={require('../../assets/dinkyimg/call2.png')} style={{ height: 60, width: 60 }} resizeMode='cover' />
              </TouchableOpacity>}
          </View>

          <View style={{ height: hp(10) }} />
        </ScrollView>
        {item?.product_owner?.id != userDetails?.id && item?.status === 'Pending' &&

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => {
                change_metting_status('Cancelled', item?.id)
              }}
              style={styles.declineButton}>
              {loading && loader === 'Cancelled' ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={styles.buttonText}>Decline</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                change_metting_status('Accepted', item?.id)
              }}
              style={styles.acceptButton}>
              {loading && loader === 'Accepted' ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={styles.buttonText}>Accept</Text>}
            </TouchableOpacity>
          </View>}
        {item?.product_owner?.id != userDetails?.id && item?.status === 'Accepted' &&



          <TouchableOpacity
            onPress={() => {


              Alert.alert(
                "Meeting Complete", // Title of the alert
                "Are you sure the meeting is complete?", // Message of the alert
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "Yes, Complete",
                    onPress: () => change_metting_status('Completed', item?.id)
                  }
                ],
                { cancelable: false }
              );
            }}
            style={{ backgroundColor: '#2ECC71', paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600' }}>Metting Completed</Text>
          </TouchableOpacity>
        }

      </View>

      {/* <Text style={styles.listTitle}>List of Socials</Text>
      <View style={styles.socialList}>
        <View style={styles.socialItem}>
          <Image
            source={{ uri: 'https://example.com/nick-image.jpg' }} // Replace with actual image URL or local file
            style={styles.profileImage}
          />
          <Text style={styles.socialText}>Nick Pletyniuk (host)</Text>
          <Text style={styles.checkMark}>✔️</Text>
        </View>

        <View style={styles.socialItem}>
          <Image
            source={{ uri: 'https://example.com/jason-image.jpg' }} // Replace with actual image URL or local file
            style={styles.profileImage}
          />
          <Text style={styles.socialText}>Jason Diego</Text>
          <Text style={styles.checkMark}>✔️</Text>
        </View>
      </View> */}

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
    , backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  declineButton: {
    backgroundColor: '#E74C3C', // Red color
    padding: 15,
    borderRadius: 8,
    flex: 0.45,
  },
  acceptButton: {
    backgroundColor: '#2ECC71', // Green color
    padding: 15,
    borderRadius: 8,
    flex: 0.45,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  generalInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '500'
  },
  listTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  socialList: {
    flexDirection: 'column',
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  socialText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  checkMark: {
    color: '#2ECC71', // Green color
    fontSize: 20,
  },
});

export default MeetingInforMation;
