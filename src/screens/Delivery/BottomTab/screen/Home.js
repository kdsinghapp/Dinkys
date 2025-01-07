
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { styles } from '../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { DOMAIN } from '../../../../services/Config';
import localizationStrings from '../../../Localization/Localization';

export default function Home() {
  const navigation = useNavigation();
  const [StatusIndex, setStatusIndex] = useState(0)
  const [Status, setStatus] = useState('New Order')
  const [user, setUser] = useState(null)
  const [AllOrder, setAllOrder] = useState([])
  const [StatusOrder, setStatusOrder] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const userDetailData = useSelector((state) => state.user.user)

  const status = [
    {
      name: localizationStrings.new_order,
      status: 'New Order'
    },
    {
      name: localizationStrings.all,
      status: 'All'
    },
    {
      name: localizationStrings.Accepted,
      status: 'Accepted'
    },
    {
      name: localizationStrings.Pickuped,
      status: 'Pickuped'
    },
    {
      name: localizationStrings.deliver,
      status: 'Delivered'
    },
  
    {
      name: localizationStrings.cancel,
      status: 'Cancelled'
    },
  
  ]

  function formatDate(timestamp) {
    const date = new Date(timestamp);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const dayName = days[date.getDay()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${month} ${day}, ${dayName} ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  const isFocus = useIsFocused()

  useFocusEffect(
    React.useCallback(() => {

      _get_profile()
      _get_allOrder()
      _get_StatusOrder('Pending'); 
    }, [isFocus])
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
  const _get_allOrder = async () => {
    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);

    const requestOptions = {
      method: "POST",
      body: null,
      redirect: "follow"
    };
    await fetch(`${DOMAIN}orders`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.status == "1") {
          setLoading(false)
          setAllOrder(res?.result)

        }
        setLoading(false)
      }).catch((err) => {
        console.log("err", err)
        setLoading(false)
      })
  }

  console.log(' user?.driver_data?.driver_id',  user?.id , user?.driver_data?.driver_id);
  
  const _get_StatusOrder = async (status) => {
    console.log('status',status);
    
    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
    var formdata = new FormData();
    formdata.append("user_id", user?.id);
    formdata.append("driver_id", user?.driver_data?.driver_id);
    formdata.append("status", status);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    await fetch(`${DOMAIN}order_by_status`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        console.log('res?.result',res);
        if (res.status == "1") {
          setLoading(false)
          console.log('res?.result',res?.result);
          
          setStatusOrder(res?.result)
        }

        setLoading(false)
      }).catch((err) => {
        console.log("err", err)
        setLoading(false)
      })
  }



  const Selected_List = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderDetails', { item: item, status: Status, user: user, sellerData: item.seller_data });
      }}
      style={[
        styles.shadow,

        {
          height: hp(18),
          borderRadius: 10,
          marginTop: 10,
          backgroundColor: '#FFF',
          marginHorizontal: 5,
          borderRadius: 20,
          flexDirection: 'row',
          marginBottom: 5,
        },
      ]}>
      <View style={{ width: '93%' }}>
        <View
          style={{
            paddingHorizontal: 15,
            height: hp(6),

            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{ paddingHorizontal: 5 }}>
            <Text
              style={{
                color: '#0BD89E',
                fontSize: 14,
                fontWeight: '700',
                lineHeight: 21,
                borderBottomWidth: 1,
                borderColor: '#0BD89E',
              }}>
              Order ID-#{item.order_id}
            </Text>
          </View>
          {/* <View>
            <Text
              style={{
                color: '#0BD89E',
                fontSize: 22,
                fontWeight: '500',
                lineHeight: 28,
              }}>
              £ {item.total_amount}
            </Text>
          </View> */}
        </View>
        <View
          style={{
            height: hp(8),
            paddingHorizontal: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',

              height: 25,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderWidth: 2,
                borderRadius: 6,
                borderColor: '#AFB1B0',
                marginTop: -3
              }}
            />
            <View>
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
              {/* <Text
              style={{
                marginLeft: 10,
                fontSize: 10,
                fontStyle: '400',
                lineHeight:12,
                color: '#111111',
              }}>
              {item.restaurant_data?.res_address}
            </Text> */}
            </View>
          </View>

          <View
            style={{
              marginLeft: 5,
              height: hp(3),
              borderColor: '#AFB1B0',

              borderLeftWidth: 2,
            }}
          />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Image
              source={require('../../../../assets/dinkyimg/Pin.png')}
              style={{ height: 12, width: 12 }}
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

        <View
          style={{
            paddingHorizontal: 15,
            height: hp(4),
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#AFB1B0',
              fontSize: 14,
              lineHeight: 21,
              fontWeight: '500',
            }}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#0BD89E',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          width: '7%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 18,
            color: '#FFF',
            transform: [{ rotate: '270deg' }],
            textAlign: 'center',
            height: 18,
            width: 79,
            alignSelf: 'center',
          }}>
          {item?.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {Platform.OS === 'ios' ? (
        <View style={{ height: 30, backgroundColor: '#fff' }} />
      ) : (
        <View style={{ height: 0 }} />
      )}
      {/* {isLoading ? <Loading /> : null} */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{localizationStrings.welcome},</Text>
          <Text style={styles.status}>{userDetailData?.user_name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>


          <Pressable
            onPress={() => {


              navigation.navigate('Bottomtab')
            }}
            style={{ paddingHorizontal: 10 }}>
            <Image source={require('../../../../assets/dinkyimg/homeActive.png')} style={{ width: 30, height: 30 }} />
          </Pressable>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Profile')
            }}
            style={{ height: 45, width: 45 }}

          >
            <Image
              source={require('../../../../assets/dinkyimg/User.png')}
              resizeMode="contain"
              style={{ height: 45, width: 45 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} >

        <View
          style={{
            paddingHorizontal: 5,
            height: hp(6),


            backgroundColor: '#F9F9F9',
            marginVertical: hp(2),
            justifyContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',

          }}>

          {/* <FlatList
            data={status}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setStatusIndex(index)
                  setStatus(item.name)
                  if (Status !== 'New Order') {

                    _get_StatusOrder(item.status)
                  }
                  else {
                    _get_allOrder()
                  }
                }}
                style={{
                  paddingHorizontal: 23,
                  marginTop: 10,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text style={{ fontWeight: '500', color: index == StatusIndex ? '#0BD89E' : '#AFB1B0', fontSize: 14 }}>
                  {item.name}

                </Text>
              </TouchableOpacity>
            )}
          /> */}
<FlatList
  data={status}
  showsHorizontalScrollIndicator={false}
  horizontal
  renderItem={({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        setStatusIndex(index);
        setStatus(item.name);  // Update status
        if (item.status !== 'New Order') {
          _get_StatusOrder(item.status);  // Call the status API for non-new orders
        } else {
          _get_StatusOrder('Pending'); 
          _get_allOrder();  // Call the new order API
        }
        
      }}
      style={{
        paddingHorizontal: 23,
        marginTop: 10,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Text style={{ fontWeight: '500', color: index === StatusIndex ? '#0BD89E' : '#AFB1B0', fontSize: 14 }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )}
/>

        </View>
{/* 
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
          }}>
          {(AllOrder?.length > 0 && Status === 'New Order') || (StatusOrder?.length > 0 && Status != 'New Order') ? <FlatList
            data={Status === 'New Order' ? AllOrder : StatusOrder}
            renderItem={Selected_List}
            keyExtractor={item => item.order_id}
            ListFooterComponent={<View style={{ height: hp(2) }} />}
            showsVerticalScrollIndicator={false}
          /> :

            <View style={{ flex: 1, justifyContent: 'center', justifyContent: 'centerc' }}>

              {loading ? <ActivityIndicator size={20} color={'#000'} /> : <Text style={{ fontSize: 16, color: "#777777", fontWeight: '500', alignSelf: 'center', marginTop: hp(30) }}>No Order Found</Text>}
            </View>

          }
        </View> */}

<View style={{ flex: 1, paddingHorizontal: 10 }}>
  {(Status === 'New Order' && AllOrder.length > 0) || (Status !== 'New Order' && StatusOrder.length > 0) ? (
    <FlatList
      data={Status === 'New Order' ? AllOrder : StatusOrder}
      renderItem={Selected_List}
      keyExtractor={item => item.order_id.toString()}
      ListFooterComponent={<View style={{ height: hp(2) }} />}
      showsVerticalScrollIndicator={false}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator size={20} color={'#000'} />
      ) : (
        <Text style={{ fontSize: 16, color: '#000', fontWeight: '500', alignSelf: 'center', marginTop: hp(30) }}>
      {localizationStrings.no_data_here}
        </Text>
      )}
    </View>
  )}
</View>

      </ScrollView>
    </View>
  );
}





