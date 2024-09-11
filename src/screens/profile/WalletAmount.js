
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, Pressable, ScrollView, Image } from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import Theme from '../../theme'
import { useSelector } from 'react-redux'
import HeaderTwo from '../../components/Header'
import NewPassword from '../auth/NewPassword'
import { errorToast } from '../../utils/customToast'
import { DOMAIN } from '../../services/Config'
const WalletAmount = ({ route }) => {
    const userDetails = useSelector((state) => state.user.user)
    const navigation = useNavigation()
    const [amount, setAmount] = useState()
    const [loading, setLoading] = useState(false)

    const add_wallet = () => {
        if (!amount) {
            errorToast("Please Enter Amount", 3000)
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("email", userDetails?.email);
            formdata.append("price", amount);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}create-checkout-session`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res?.data?.url) {
                        navigation.navigate("WebViewScreen", { details: undefined, url: res?.data?.url, shipping_charge: undefined, wallet: true, amount })
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Add Money"} />
            <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
                <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15 }}>
                    <MyText h6 bold style={{ color: "#04CFA4" }}>
                        {"Enter Amount"}
                    </MyText >
                    <TextInput value={amount} keyboardType="default" onChangeText={(e) => setAmount(e)} style={{ width: "100%", borderRadius: 10 }} placeholder="1000" placeholderTextColor={"#000"} />
                </View>
            </View >
            <MyButton loading={loading} onPress={add_wallet} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30 }} style={{ borderRadius: 16, width: "95%", alignSelf: "center", margin: 10 }} title={"Add"} />
        </View>)
}

export default WalletAmount