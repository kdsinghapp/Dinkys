import {View, Text, Image, Platform, Keyboard} from 'react-native';
import React, { useEffect, useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './screen/Home';
import Wallet from './screen/Wallet';
import Profile from '../../profile/Profile';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          height:70,
        paddingTop:Platform.OS == 'ios'?20:0,
        display: isKeyboardVisible ? 'none' : 'flex',
        },
      }}>
      <Tab.Screen
        name={'Home'}
        component={Home}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <>
            {focused ?<Image
              source={require('../../../assets/dinkyimg/homeActive.png')} // Assuming you have imported icon for each screen
              style={{
                width: 24,
                height: 24,
               
              }} 
            />:<Image
              source={require('../../../assets/dinkyimg/HomeUnactive3x.png')} // Assuming you have imported icon for each screen
              style={{
                width: 24,
                height: 24,
               
              }} 
            />
        }
            <Text style={{color:focused?'#0BD89E':'#9E9E9E',lineHeight:15,fontWeight:'600',fontSize:10,marginTop:5}}>Home</Text>
            </>
          ),
        
        }}
      />
    

      <Tab.Screen
        name={'Wallet'}
        component={Wallet}
        options={{
          tabBarIconStyle:{

          },
          tabBarIcon: ({focused, color, size}) => (
            <>
         {focused ? <Image
              source={require('../../../assets/dinkyimg/walletActive.png')} // Assuming you have imported icon for each screen
              style={{
                width: 24,
                height: 24,
                
              }} 
            />:
<Image
              source={require('../../../assets/dinkyimg/wallet_!x.png')} // Assuming you have imported icon for each screen
              style={{
                width: 24,
                height: 24,
                
              }} 
            />
        }
            <Text style={{color:focused?'#0BD89E':'#9E9E9E',lineHeight:15,fontWeight:'600',fontSize:10,marginTop:5}}>Wallet</Text>
            </>
            
       
          ),

        }}
      />
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <>
          {focused? <Image
              source={require('../../../assets/dinkyimg/userActive.png')} // Assuming you have imported icon for each screen
              style={{
                width: 24,
                height: 24,
                
              }} 
            />:
            <Image
              source={require('../../../assets/dinkyimg/Profile3x.png')} // Assuming you have imported icon for each screen
              style={{
                width: 24,
                height: 24,
                
              }} 
            />}
            <Text style={{color:focused?'#0BD89E':'#9E9E9E',lineHeight:15,fontWeight:'600',fontSize:10,marginTop:5}}>Profile</Text>
            </>
          ),
         
        }}
      />
    </Tab.Navigator>
  );
}
