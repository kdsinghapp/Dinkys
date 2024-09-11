import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ratting from './Ratting'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
export default function MapDeliverd() {
    return (
        <ImageBackground style={{flex:1}} source={require('../../assets/dinkyimg/map2.png')}>
    
    
    
    <View
            style={[
              styles.shadow,
              {
                backgroundColor: '#FFF',
                padding: 5,
                borderRadius: 10,
                marginHorizontal: 5,
                marginVertical: 5,
                marginTop: 20,
                position:'absolute',
                bottom:120,
                alignSelf:'center'
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
           <TouchableOpacity 
          onPress={()=>{
            navigation.navigate('TabNavigator')
          }}
          style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Delivered</Text>
          </TouchableOpacity>
        </ImageBackground>
      )
}
const styles=StyleSheet.create({
    shadow:{shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
    continueButton: {
        height: 55,
        backgroundColor: '#0BD89E',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      position:'absolute',
        bottom:30,
        width:'95%',
        alignSelf:'center'
      },
      continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
})