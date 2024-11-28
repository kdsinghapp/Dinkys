
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Back from '../../assets/svg/Back.svg'
import { styles } from './styles';
import { DOMAIN } from '../../services/Config';
import { errorToast, successToast } from '../../utils/customToast';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { width } from '../../utils/Constant';
import localizationStrings from '../Localization/Localization';
export default function OrderDetails() {
  const [activeIndex, setActiveIndex] = useState(0); // State to track the active index

  const onViewRef = useRef(({ viewableItems }) => {
      if (viewableItems.length > 0) {
          setActiveIndex(viewableItems[0].index);
      }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const route = useRoute()

  const { item, status, user, sellerData } = route.params
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKM = R * c; // Distance in km
    const distanceM = distanceKM * 1000; // Distance in meters
    const check = {
      km: distanceKM.toFixed(2),
      m: distanceM.toFixed(2)
    };


    const distanceDisplay = check.km < 1 ? `${check.m} meters` : `${check.km} km`;
    return distanceDisplay
  };

  useEffect(() => {

    requestCallPermission()
  }, []);
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
          console.log("GRANTED");
        } else {
          console.log("Call Phone permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const distances = calculateDistance(
    parseFloat(item?.product_data?.lat),
    parseFloat(item?.product_data?.long),
    parseFloat(item?.lat),
    parseFloat(item?.long)
  );

  const makePhoneCall = (Number) => {

    try {
      RNImmediatePhoneCall.immediatePhoneCall(Number);
    }
    catch (err) {
      console.log(err);
    }
  }


  const Order_accept = async () => {
    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    var formdata = new FormData();
    formdata.append("order_id", item?.order_id);
    formdata.append("driver_id", user?.driver_data?.driver_id);


    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    await fetch(`${DOMAIN}acceptOrder`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        console.log('res', res);
        if (res.status == "1") {

          successToast('Order Accepted Successfully')
          setLoading(false)
          navigation.goBack()
        }
        else {
          errorToast(res.message)
          setLoading(false)
        }
      }).catch((err) => {
        console.log("err", err)
        setLoading(false)
      })



  }

console.log('item.status',item.status);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 15 }}>
  
      <ScrollView showsVerticalScrollIndicator={false}>
      <View
          style={{
            height: hp(5),
            justifyContent: 'center',
position:'absolute',top:35,zIndex:1,
           left:10
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Back />
          </TouchableOpacity>
        </View>
        <View style={{
          height: hp(10),
          position:'absolute',top:15,
          left:'38%',
          justifyContent: 'center'
        }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              lineHeight:20,
              color: '#09051C',
            }}>
            Order ID- #{item?.order_id}
          </Text>
        </View>
      <FlatList
                        data={item?.product_data.product_images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: width, // Full width of the screen for each image
                                    height: hp(20),
                                    marginLeft: 10,
                                    marginTop:hp(10)
                                }}
                                resizeMode='contain'
                            />
                        )}
                        onViewableItemsChanged={onViewRef.current}
                        viewabilityConfig={viewConfigRef.current}
                    />
                     <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        {item?.product_data.product_images?.map((_, index) => (
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
     
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
          }}>
          <View
            style={[
              styles.shadow,
              {

                backgroundColor: '#FFF',
                borderRadius: 10,
                paddingHorizontal: 10,
                justifyContent: 'center',

                height: hp(12),
                width: '100%'
              },
            ]}>
            <View
              style={[

                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  width: '100%',
                  alignItems: 'center',


                },
              ]}>
              <View style={{ width: '50%', }}>
                <Text
                  style={{
                    color: '#0BD89E',
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: '500',
                  }}>
                 {localizationStrings.order_details}
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    lineHeight: 18,
                    fontWeight: '500',
                  }}>
                  ID #{item?.order_id}
                </Text>

              </View>
              <View style={{}}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    lineHeight: 18,
                    fontWeight: '500',
                  }}>
                  {item?.payment_status == 'paid' ? 'Paid' : 'Cash On Delivery'}
                </Text>
              </View>

            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontWeight: '500', color: '#1F1D1A', fontSize: 12 }}>Total Earning</Text>

              </View>
              <View>
                <Text style={{ fontWeight: '800', color: '#1F1D1A', fontSize: 14, lineHeight: 30 }}>£ {item?.shipping_charge}</Text>
              </View>
            </View>
          </View>

        </View>

        <View
          style={{
            paddingVertical: 10,
            marginTop: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            flexDirection: 'row',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignItems: 'center',

                marginTop: 10
              }}>
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderWidth: 2,
                  borderRadius: 6,
                  borderColor: '#AFB1B0',
                  marginTop: -4
                }}
              />

              <View style={{}}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 12,
                    fontStyle: '600',
                    lineHeight: 12,
                    color: '#000',

                  }}>
                  {item?.product_data?.product_location?.substring(0, 120)}
                </Text>

              </View>
            </View>

            <View
              style={{
                marginLeft: 5,
                height: hp(4),
                borderColor: '#AFB1B0',
                marginTop: -4,
                borderLeftWidth: 1,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 2,
                marginLeft: -2,
                height: 25,
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/dinkyimg/Pin.png')}
                style={{ height: 15, width: 15 }}
              />
              <View>

                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 12,
                    fontStyle: '400',
                    lineHeight: 14,
                    color: '#111111',

                  }}>
                  {item?.shipping_address?.substring(0, 120)}
                </Text>

              </View>
            </View>
          </View>


          <View style={{}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                lineHeight: 27,
                color: '#777777',
              }}>
              {distances}
            </Text>
          </View>
        </View>



        <View style={{ marginTop: 20 }}>
          <View>
            <Text style={{ fontWeight: '600', fontSize: 18, lineHeight: 20, color: '#111111' }}>{localizationStrings.custmore}</Text>
          </View>
          <View
            style={[
              styles.shadow,
              {
                backgroundColor: '#FFF',
                padding: 5,
                borderRadius: 10,
                marginHorizontal: 5,
                marginVertical: 5,
                marginTop: 20
              },
            ]}>
            <View
              style={{
                paddingVertical: 5,


              }}>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',


                  height: hp(5),
                  alignItems: 'center',
                }}>

                <View>

                </View>
                <View>
                  <Image
                    source={{ uri: item?.customer_data.image }}
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 15,

                    }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ width: '65%', }}>

                  <Text
                    style={{
                      fontSize: 16,
                      color: '#000',
                      fontWeight: '500',
                      lineHeight: 17,
                    }}>
                    {item?.customer_data.user_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000',
                      fontWeight: '500',
                      lineHeight: 17,
                    }}>
                    {item?.customer_data.mobile}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    makePhoneCall(item?.customer_data.mobile)
                  }}
                >
                  <Image
                    source={require('../../assets/dinkyimg/call.png')}
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 30,

                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <View style={{ width: '70%' }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#1F1D1A',
                      fontWeight: '500',
                      marginLeft: 40,
                      lineHeight: 13,
                    }}>
                    {item.customer_data.address}
                  </Text>

                </View>

              </View>
            </View>


          </View>


        </View>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          marginTop: 20, justifyContent: 'space-between',
          paddingHorizontal:10
        }}>
          <View>

            <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>{localizationStrings.product_price}</Text>

          </View>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>£ {item?.total_amount}</Text>
        </View>
        <View style={{ flexDirection: 'row',
             paddingHorizontal:10,
        alignItems: 'center', marginTop: 20, justifyContent: 'space-between' }}>

          <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}> {localizationStrings.Shipping_charges}</Text>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>£ {item.shipping_charge}</Text>
        </View>
        <View style={{ flexDirection: 'row',      paddingHorizontal:10, alignItems: 'center', marginTop: 20, justifyContent: 'space-between' }}>

          <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}> {localizationStrings.late_night}</Text>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>£ {item.late_night_charges}</Text>
        </View>

        <View style={{ flexDirection: 'row',       paddingHorizontal:10,alignItems: 'center', marginTop: 20, justifyContent: 'space-between' }}>
          <View>

            <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}> {localizationStrings.discount}</Text>
           {item.discount != 0 && <Text style={{ fontSize: 12, color: '#1F1D1A', fontWeight: '600' }}>Promo Code: 554dffd</Text>}
          </View>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>£ {item.discount}</Text>
        </View>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          padding:10,
          borderTopWidth: 0.5, paddingVertical: 10,
          marginTop: 20, justifyContent: 'space-between'
        }}>
          <View>

            <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}> {localizationStrings.order_details}</Text>

          </View>
          <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>£ {item?.total_amount}</Text>
        </View>

        {status == 'New Order' && <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 30, marginTop: 10,
          marginTop: 20, justifyContent: 'space-between'
        }}>
          <TouchableOpacity
            onPress={() => {
              Order_accept()
            }}

            style={{ borderRadius: 15, width: '100%', height: 50, backgroundColor: '#15BE77', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Accept</Text>}
          </TouchableOpacity>

        </View>
        }
     {item.status === 'Pickuped'  && (
  <View style={{ flexDirection: 'row', alignItems: 'center',

  paddingHorizontal: 30, marginTop: 20, justifyContent: 'space-between' }}>
    <TouchableOpacity
      onPress={() => {
        if (item.status === 'Accepted') {
          navigation.navigate('MapPickup', { order: item, item: item?.product_data, sellerData: sellerData, userData: item?.customer_data });
        } else if (item.status === 'Pickuped') {
          navigation.navigate('MapDeliverd', { item: item?.product_data, sellerData: sellerData, userData: item?.customer_data, order: item });
        }
      }}
      style={{ borderRadius: 15, width: '100%', height: 50, backgroundColor: '#15BE77', alignItems: 'center', justifyContent: 'center' }}
    >
      {loading ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Track</Text>}
    </TouchableOpacity>
  </View>
)}
     {item.status === 'Accepted'  && (
  <View style={{ flexDirection: 'row', alignItems: 'center',

  paddingHorizontal: 30, marginTop: 20, justifyContent: 'space-between' }}>
    <TouchableOpacity
      onPress={() => {
        if (item.status === 'Accepted') {
          navigation.navigate('MapPickup', { order: item, item: item?.product_data, sellerData: sellerData, userData: item?.customer_data });
        } else if (item.status === 'Pickuped') {
          navigation.navigate('MapDeliverd', { item: item?.product_data, sellerData: sellerData, userData: item?.customer_data, order: item });
        }
      }}
      style={{ borderRadius: 15, width: '100%', height: 50, backgroundColor: '#15BE77', alignItems: 'center', justifyContent: 'center' }}
    >
      {loading ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Track</Text>}
    </TouchableOpacity>
  </View>
)}


        <View  style={{height:hp(10)}} />
      </ScrollView>
    </View>
  );
}


