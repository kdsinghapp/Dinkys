
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Pressable, View, TextInput, ScrollView, Image, Text
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import { useDispatch, useSelector } from 'react-redux'
import ProRight from "../../assets/svg/proright.svg"
import HeaderTwo from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'

const Data = [
    {
        id: 1,
        name: "Edit Profile",
        path: "EditProfile"
    },
    {
        id: 2,
        name: "Change Password",
        path: "ChangePassword"
    },
    {
        id: 3,
        name: "Shipping Address",
        path: "ShippingAddress"
    },
    {
        id: 4,
        name: "Notification",
        path: "Notification"
    },
    {
        id: 5,
        name: "FAQ",
        path: "FAQ"
    },
    {
        id: 6,
        name: "About us",
        path: "About"
    },
    {
        id: 7,
        name: "Privacy Policy",
        path: "Privacy"
    }
]

const SettingScreen = ({ navigation, route }) => {
    const { userDetails } = route?.params

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Settings"} />
            <View style={{ backgroundColor: "#fff", padding: 25, }}>
                {Data.map((item, index) => {
                    return (
                        <Pressable onPress={() => navigation.navigate(item.path, { userDetails })} key={index} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingVertical: 20 }}>
                            <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>{item.name}</Text>
                            <ProRight width={24} height={24} />
                        </Pressable>
                    )
                })}
            </View>
        </View >
    )
}

export default SettingScreen