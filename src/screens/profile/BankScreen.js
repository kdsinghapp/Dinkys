/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import RechargeSvg from "../../assets/svg/Recharge.svg"
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'


const BankScreen = ({ route }) => {
    const navigation = useNavigation()
    const userDetails = useSelector((state) => state.user.user)
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(false)



    useFocusEffect(
        React.useCallback(() => {
            _accountDetails()
        }, [])
    )
    const _accountDetails = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_my_account`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                console.log("res", res)
                if (res.status == "1") {
                    setAccount(res?.result)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={"Bank Details"} navigation={navigation} />
            <View style={{ flex: 1, padding: 20 }}>
                <Pressable onPress={() => navigation.navigate("AddCardDetails")} style={{ height: 206, width: "100%",
                 borderRadius: 15, elevation: 5, backgroundColor: "#e7fbf5", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ color: "#000",fontWeight:'600',fontSize:18 }}>Credit or debit card</Text>
                    <RechargeSvg width={41} height={41} style={{ marginTop: 20 }} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("AddCardDetails")} 
                style={{ height: 206, width: "100%", borderRadius: 15, elevation: 5,
                
                backgroundColor: "#e7fbf5", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                    <Text style={{ color: "#000",fontWeight:'600',fontSize:18 }}>Bank Account</Text>
                    <RechargeSvg width={41} height={41} style={{ marginTop: 20 }} />
                </Pressable>

                <Pressable style={{position:'absolute',bottom:50,right:30}}>
                    <Image source={require('../../assets/dinkyimg/AddCard3x.png')}  style={{height:50,width:50,}}/>
                </Pressable>
                {loading ?
                    <View style={{ marginTop: 30, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                    :
                    account == null ? null :
                        <View style={{
                            marginTop: 30, width: "100%", padding: 15, borderRadius: 12, shadowOpacity: 0.8,
                            shadowRadius: 2,
                            shadowOffset: {
                                height: 0,
                                width: 0
                            },
                            backgroundColor: "#fff",
                            elevation: 5,
                        }}>
                            <MyText h5 semibold >Card Name: {account?.card_holder_name}</MyText>
                            <MyText h5 regular >Card No.: {account?.card_number}</MyText>
                        </View>

                }

            </View >
        </View>

    )
}

export default BankScreen
