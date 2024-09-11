
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Pressable, View, TextInput, ScrollView, Image, ActivityIndicator, Text
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import { useDispatch, useSelector } from 'react-redux'
import EditSvg from "../../assets/svg/Edit.svg"
import AddressSvg from "../../assets/svg/Address.svg"
import HeaderTwo from '../../components/Header'
import MyButton from '../../elements/MyButton'
import Theme from '../../theme'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
const ShippingAddress = ({ navigation }) => {
    const userDetails = useSelector((state) => state.user.user)
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState([])


    useFocusEffect(
        React.useCallback(() => {
            _get_address()
        }, [])
    )

    console.log("address", address)

    const _get_address = () => {
        setLoading(true)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_user_address?user_id=${userDetails?.id}`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setAddress(res?.result)
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
            <HeaderTwo navigation={navigation} title={"Address"} />
            <View style={{ flex: 1, padding: 25 }}>
                {loading ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                    :
                    address?.length == 0 ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

                    </View>
                        :
                        address?.map((item, index) => {
                            return (
                                <View key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 15, justifyContent: "space-between", elevation: 5, borderRadius: 12 }}>
                                    <AddressSvg width={59} height={59} />
                                    <View style={{ width: "68%" }}>
                                        <Text style={{fontSize:20,color:'#000',fontWeight:'700'}}>{item?.type}</Text>
                                        <MyText h6 regular>{item?.location}</MyText>
                                    </View>
                                    <EditSvg width={24} height={24} />
                                </View>
                            )
                        })
                }


            </View>
            <MyButton onPress={() => navigation.navigate("AddAddress")} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30 }} style={{ borderRadius: 16, width: "95%", alignSelf: "center", margin: 10 }} title={"Add Address"} />

        </View >
    )
}

export default ShippingAddress