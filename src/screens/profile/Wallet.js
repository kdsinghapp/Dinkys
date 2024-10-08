/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Pressable, Image, View, TouchableOpacity, TextInput, ScrollView, ImageBackground, FlatList, Text
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import RechargeSvg from "../../assets/svg/Recharge.svg"
import PaySvg from "../../assets/svg/Charge.svg"
import WithDraw from "../../assets/svg/Withdraw.svg"
import ProRight from "../../assets/svg/proright.svg"
import BankSvg from "../../assets/svg/bank.svg"
import HistorySvg from "../../assets/svg/history.svg"



const Wallet = ({ route }) => {
    const { user } = route?.params
    const navigation = useNavigation()

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={"Wallet"} navigation={navigation} />
            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ padding: 20, width: "100%", borderRadius: 15, elevation: 5, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
                <Text  style={{color:'#04CFA4',fontWeight:'600',fontSize:16,marginTop:10}}>Principal. USD</Text>
                <Text  style={{color:'#04CFA4',fontWeight:'700',fontSize:22,marginTop:10}}>{user?.wallet}</Text>
                    <View style={{ width: "100%", borderRadius: 15, marginTop: 15, flexDirection: "row", backgroundColor: "#fff", alignItems: "center" }}>
                        <Pressable onPress={() => navigation.navigate("WalletAmount")} style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                            <RechargeSvg width={41} height={41} />
                            <Text  style={{color:'#04CFA4',fontWeight:'500',fontSize:14,marginTop:10}}>Recharge</Text>
                        </Pressable>
                        <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                            <PaySvg width={41} height={41} />
                            <Text  style={{color:'#04CFA4',fontWeight:'500',fontSize:14,marginTop:10}}>Pay</Text>
                        </View>
                        <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                            <WithDraw width={41} height={41} />
                  
                                
                            <Text  style={{color:'#04CFA4',fontWeight:'500',fontSize:14,marginTop:10}}>Withdraw</Text>
                        </View>
                    </View>
                </View>
                <Pressable onPress={() => navigation.navigate("BallanceHistory")} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 20, justifyContent: "space-between", marginTop: 20 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 40 / 2, backgroundColor: "#04CFA410", justifyContent: "center", alignItems: "center" }}>
                        <HistorySvg width={24} height={24} />
                    </View>
                    <View style={{ width: "75%" }}>
                    <Text  style={{color:'#000',fontWeight:'500',fontSize:16}}>Balance History</Text>
                    </View>
                    <ProRight width={16} height={16} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("BankScreen")} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 20, justifyContent: "space-between", marginTop: 10 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 40 / 2, backgroundColor: "#04CFA410", justifyContent: "center", alignItems: "center" }}>
                        <BankSvg width={24} height={24} />
                    </View>
                    <View style={{ width: "75%" }}>
                    <Text  style={{color:'#000',fontWeight:'600',fontSize:16}}>Bank Details</Text>
                    </View>
                    <ProRight width={16} height={16} />
                </Pressable>

            </View >
        </View>

    )
}

export default Wallet
