
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Back  from '../../assets/svg/Back.svg'
import { styles } from './styles';

export default function OrderDetails() {

  const route = useRoute()

  const { item } = route.params
  const navigation = useNavigation();

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
   const  check ={
      km: distanceKM.toFixed(2),
      m: distanceM.toFixed(2)
    };


    const distanceDisplay = check.km < 1 ? `${check.m} meters` : `${check.km} km`;
    return distanceDisplay
  };
  const distances = calculateDistance(
    parseFloat(item?.product_data?.lat),
    parseFloat(item?.product_data?.long),
    parseFloat(item?.lat),
    parseFloat(item?.long)
  );



  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 15 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: hp(5),
            justifyContent: 'center',

            marginTop:20,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Back  />
          </TouchableOpacity>
        </View>
        <View style={{
          height: hp(10),

          justifyContent: 'center'
        }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              lineHeight: 36,
              color: '#09051C',
            }}>
            Order ID- #{item?.order_id}
          </Text>
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

                height:hp(12),
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
               width:'100%',
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
                ORDER DETAILS
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
                {item?.payment_status == 'paid' ? 'Paid':'Cash On Delivery' }
              </Text>
            </View>
            
          </View>
          <View style={{flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between'}}>
              <View>
                <Text style={{ fontWeight: '500', color: '#1F1D1A', fontSize: 12 }}>Total Earning</Text>

              </View>
              <View>
                <Text style={{ fontWeight: '800', color: '#1F1D1A', fontSize:14, lineHeight: 30 }}>£ {item?.shipping_charge}</Text>
              </View>
            </View>
          </View>

        </View>

        <View
          style={{
 paddingVertical:10,
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
                width:'90%',
                alignItems: 'center',
          
                marginTop:10
              }}>
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderWidth: 2,
                  borderRadius: 6,
                  borderColor: '#AFB1B0',
                  marginTop:-4
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
                  {item?.product_data?.product_location?.substring(0,120)}
                </Text>
                
              </View>
            </View>

            <View
              style={{
                marginLeft:5,
               height:hp(4),
                borderColor: '#AFB1B0',
                marginTop:-4,
                borderLeftWidth: 1,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 2,
                marginLeft:-2,
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
                 {item?.shipping_address?.substring(0,120)}
                </Text>
                
              </View>
            </View>
          </View>


          <View style={{}}>
            <Text
              style={{
                fontSize:14,
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
            <Text style={{ fontWeight: '600', fontSize: 18, lineHeight:20, color: '#111111' }}>Customer</Text>
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
                <View style={{ width: '75%', }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#000',
                      fontWeight: '500',
                      lineHeight:17,
                    }}>
                  Nity Make
                  </Text>
                </View>
                <View>
                  <Image
                    source={require('../../assets/dinkyimg/call.png')}
                    style={{
                      height:60,
                      width:60,
                      borderRadius: 30,
                    
                    }}
                    resizeMode="contain"
                  />
                </View>
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
                     
                      lineHeight: 13,
                    }}>
               2 New Nehru Nagar Indore 457415, Madhya Pradesh
                  </Text>
                 
                </View>

              </View>
            </View>


          </View>

        
        </View>
      
      <View style={{flexDirection:'row',alignItems:'center',marginTop:20,justifyContent:'space-between'}}>

<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>Late NIght Surcharge</Text>
<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>$50</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',marginTop:20,justifyContent:'space-between'}}>
<View>

<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>Move Cart</Text>
<Text style={{fontSize:12,color:'#1F1D1A',fontWeight:'600'}}>Additional Services</Text>
</View>
<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>$20</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',marginTop:20,justifyContent:'space-between'}}>
<View>

<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>Discount</Text>
<Text style={{fontSize:12,color:'#1F1D1A',fontWeight:'600'}}>Promo Code: 554dffd</Text>
</View>
<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>$20</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',
      
      borderTopWidth:0.5,paddingVertical:10,
      marginTop:20,justifyContent:'space-between'}}>
<View>

<Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>Total</Text>

</View>
<Text style={{fontSize:16,color:'#000',fontWeight:'700'}}>${item?.total_amount}</Text>
      </View>

      <View style={{flexDirection:'row',alignItems:'center',
      paddingHorizontal:30,marginTop:10,
      marginTop:20,justifyContent:'space-between'}}>
<TouchableOpacity
onPress={()=>{
  navigation.navigate('MapPickup')
}}

style={{borderRadius:15,width:'48%',height:50,backgroundColor:'#15BE77',alignItems:'center',justifyContent:'center'}}>
<Text style={{fontSize:16,color:'#fff',fontWeight:'700'}}>Accept</Text>
</TouchableOpacity>
<TouchableOpacity style={{borderRadius:15,width:'48%',height:50,backgroundColor:'#FF0000',alignItems:'center',justifyContent:'center'}}>
<Text style={{fontSize:16,color:'#fff',fontWeight:'700'}}>Decline</Text>
</TouchableOpacity>
      </View>
  
      </ScrollView>
    </View>
  );
}


const Styles = StyleSheet.create({
  btn: {
    width: '48%',
    height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 30,
  },
  div: {
    height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10
  }
})