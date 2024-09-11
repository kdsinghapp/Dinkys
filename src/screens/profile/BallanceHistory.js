/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Pressable, Image, View, TouchableOpacity, TextInput, ScrollView, ImageBackground, FlatList, ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { DOMAIN } from '../../services/Config'
import moment from 'moment'
const BallanceHistory = ({ route }) => {
    const navigation = useNavigation()
    const userDetails = useSelector((state) => state?.user?.user)
    const [balance, setBalance] = useState([])
    const [loading, setLoading] = useState(false)


    useFocusEffect(
        React.useCallback(() => {
            _get_balance()
        }, [])
    )
    const _get_balance = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-my-balance-history`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    setBalance(res.result)
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
            <HeaderTwo title={"Ballance History"} navigation={navigation} />
            <ScrollView contentContainerStyle={{ flex: 1, padding: 20 }}>
                {loading ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                    :
                    balance?.length == 0 ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <MyText>No data here...</MyText>
                        </View>
                        :
                        balance.map((item, index) => {
                            return (
                                <View key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", marginVertical: 15, borderBottomWidth: 0.5, paddingBottom: 20, borderColor: "#949494" }}>
                                    <View style={{ width: 60, height: 60, borderRadius: 20 / 2, backgroundColor: "#CACACA40" }}>
                                    </View>
                                    <View style={{ width: "58%" }}>
                                        <MyText h5 bold>Rechargel </MyText>
                                        <MyText h6 regular>Recharge Jan 10</MyText>
                                    </View>
                                    <View >
                                        <MyText h6 bold style={{textAlign:"right"}}>$ {item?.amount}</MyText>
                                        <MyText h6 regular>{moment(item?.created_at).format("DD MMM YYYY")}</MyText>


                                    </View>
                                </View>
                            )
                        })
                }

            </ScrollView >
        </View>

    )
}

export default BallanceHistory
