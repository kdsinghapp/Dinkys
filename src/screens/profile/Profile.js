
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Pressable, View, TextInput, ScrollView, Image, Text, TouchableOpacity
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import { useDispatch, useSelector } from 'react-redux'
import ProRight from "../../assets/svg/proright.svg"
import HeaderTwo from '../../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import Ratting from '../Delivery/Ratting'

const Profile = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()

    useFocusEffect(
        React.useCallback(() => {
            _get_profile()
        }, [userDetailData])
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

    return (
        <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} back={true} title={"Profile"} />
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('EditProfile', { userDetails: user })
                    }}
                    style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 25, justifyContent: "space-between" }}>
                    <View style={{ width: 80, height: 80, borderRadius: 80 / 2, borderWidth: 0.5, overflow: "hidden" }}>
                        {user?.image?.length === 0 ? null : <Image source={{ uri: user?.image }} style={{ width: "100%", height: "100%", borderRadius: 80 / 2 }} />}
                    </View>
                    <View style={{ width: "60%" }}>
                        <Text style={{ color: '#1D3A70', fontWeight: '700', fontSize: 18 }}>{user?.user_name}</Text>
                        <Text style={{ color: '#666666', fontWeight: '600', fontSize: 12 }}>{user?.email}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10, marginTop: 10 }}>
                            <Ratting Ratting={user?.rating} />
                            <Text style={{ marginLeft: 15, color: '#000', fontWeight: '600' }}>{user?.rating}</Text>
                        </View>
                    </View>
                    <ProRight width={16} height={16} />
                </TouchableOpacity>
                <View style={{ backgroundColor: "transparent", padding: 25, justifyContent: "space-between", paddingVertical: 20 }}>
                    <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 18 }} >Transaction</Text>
                </View>
                <View style={{ backgroundColor: "#fff", padding: 25, }}>

                    <Pressable
                        onPress={() => navigation.navigate("Metting")}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Metting request</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                </View>
                <View style={{ backgroundColor: "#fff", padding: 25, }}>

                    <Pressable
                        onPress={() => navigation.navigate("Purchases")}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Purchases</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate("Sales")}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 30 }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Sales</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate("Wallet", { user })}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Wallet</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                </View>
                <View style={{ backgroundColor: "transparent", padding: 25, justifyContent: "space-between", paddingVertical: 20 }}>
                    <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 18 }} >Account</Text>
                </View>
                <View style={{ backgroundColor: "#fff", padding: 25, }}>
                    <Pressable onPress={() => user == null ? null : navigation.navigate("SettingScreen", { userDetails: user })} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Setting</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable

                        onPress={() => user == null ? null : navigation.navigate("Help", { userDetails: user })}

                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 30 }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Help</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable onPress={() => {
                        AsyncStorage.clear(),
                            dispatch({ type: 'SET_USER', payload: null }),
                            navigation.navigate("Login")
                    }} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Logout</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                </View>
                {(user?.driver_details_data || user?.driver_data) &&
                    <>
                        <View style={{ backgroundColor: "transparent", padding: 25, justifyContent: "space-between", paddingVertical: 20 }}>
                            <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 18 }} >Driver Details</Text>
                        </View>
                        <View style={{ backgroundColor: "#fff", padding: 25, }}>
                            {user?.driver_data && <Pressable onPress={() => navigation.navigate("DriverProfile")} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Details</Text>
                                <ProRight width={24} height={24} />
                            </Pressable>}
                            {user?.driver_details_data && <Pressable
                                onPress={() => {
                                    navigation.navigate('DriverDocument')
                                }}
                                style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 30 }}>
                                <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Document</Text>
                                <ProRight width={24} height={24} />
                            </Pressable>}

                        </View>
                    </>
                }
            </ScrollView>

        </View >
    )
}

export default Profile