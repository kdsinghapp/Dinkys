import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ratting from './Ratting'
import { useNavigation } from '@react-navigation/native'

export default function MapPickup() {

    const navigation = useNavigation()
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
              position:'absolute',
              width:'90%',
              bottom:120,
              alignSelf:'center'
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
               paddingHorizontal:10,
                marginTop: 10,
              }}>
                   
              <View style={{width:'85%'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: 18,
                    color: '#1F1D1A',
                  }}>
                Mohan Mobile shop
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#000',
                    fontWeight: '400',
                    lineHeight: 18,
                  }}>
              2 New Nehru Nagar Indore 457415, 
Madhya Pradesh
                </Text>
                
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '35%',
                  position:'absolute',
                  right:0,
                  top:-5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  
                }}>
               <Ratting   Ratting={3.5} />
               
                <Text
                  style={{
                    fontSize: 10,
                    color: '#000',
                    fontWeight: '700',
                    lineHeight: 14,
                  }}>
               4.5
                </Text>
              </View>
            </View>
        
          </View>
<View style={{flexDirection:'row',alignItems:'center',padding:10}}> 
<View>
<Image
                  source={{uri:'https://cdn.mos.cms.futurecdn.net/yDn3ZSXu9eSBxmXQDZ4PCF-1200-80.jpg'}}
                  style={{
                    height:50,
                    width:50,
                    borderRadius: 25,
                    
                  }}
                  resizeMode="cover"
                />
</View>
<View style={{width:'60%',marginLeft:10}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: 18,
                    color: '#1F1D1A',
                  }}>
               iPhone 13
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#000',
                    fontWeight: '400',
                    lineHeight: 18,
                  }}>
  Western food  $59 Per plate
                </Text>
                
              </View>
<View style={{marginLeft:10}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: 18,
                    color: '#1F1D1A',
                  }}>
              2 iPhone
                </Text>
                
              </View>

</View>
        </View>
       <TouchableOpacity 
      onPress={()=>{
        navigation.navigate('MapDeliverd')
      }}
      style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Pickup from restaurant</Text>
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