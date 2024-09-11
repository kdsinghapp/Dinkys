
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import PinSvg from "../../assets/svg/pin.svg"
import PickSvg from "../../assets/svg/Pick.svg"
import PersonSvg from "../../assets/svg/person.svg"
import MyButton from '../../elements/MyButton'
import HeaderTwo from '../../components/Header'
import { DOMAIN } from '../../services/Config'
import { useSelector } from 'react-redux'
import { errorToast, successToast } from '../../utils/customToast'

const Summary = ({ navigation, route }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const Wallet = useSelector((state) => state?.user?.wallet)
    const { details, address, shipping_charge } = route?.params
    const [loading, setLoading] = useState(false)
    const [selectPay, setSelectPay] = useState("card")

    const payment_handler = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        formdata.append("product_id", details?.id);
        formdata.append("shipping_address", details?.product_location);
        formdata.append("payment_status", "unpaid");
        formdata.append("total_amount", details?.price);
        formdata.append("shipping_charge", String(shipping_charge));
        formdata.append("lat", details?.lat);
        formdata.append("long", details?.long);
        formdata.append("payment_intent", "COD");
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}create_order`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    successToast("Payment Successfully", 3000)
                    navigation.navigate("Bottomtab")
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const payment_wallet = () => {
        if ((Number(details?.price) + shipping_charge) > Wallet) {
            errorToast("Please Add Money in wallet")
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("user_id", userDetails?.id);
            formdata.append("product_id", details?.id);
            formdata.append("shipping_address", details?.product_location);
            formdata.append("payment_status", "paid");
            formdata.append("total_amount", details?.price);
            formdata.append("shipping_charge", String(shipping_charge));
            formdata.append("lat", details?.lat);
            formdata.append("long", details?.long);
            formdata.append("payment_intent", "WALLET");
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}create_order`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res?.status == "1") {
                        successToast("Payment Successfully", 3000)
                        navigation.navigate("Bottomtab")
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }
    const payment_handler_web = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("email", userDetails?.email);
        formdata.append("price", details?.price);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}create-checkout-session`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.data?.url) {
                    navigation.navigate("WebViewScreen", { details, url: res?.data?.url, shipping_charge, wallet: false })
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Summary"} />
            <ScrollView style={{ backgroundColor: "#fff", flex: 1, padding: 20, paddingTop: 0 }}>
                <View style={{ width: "100%", borderRadius: 12, marginVertical: 8, padding: 15, borderWidth: 1, borderColor: "#EDEDED" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <MyText h5 bold style={{ color: "#000000" }}>
                            {details?.title}
                        </MyText >
                        <MyText h5 bold style={{ color: "#000000" }}>
                            € {details?.price}
                        </MyText >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 8 }}>
                        <MyText h5 bold style={{ color: "#C3C6C9" }}>
                            ROT Protection Fee
                        </MyText >
                        <MyText h5 bold style={{ color: "#C3C6C9" }}>
                            € 0.00
                        </MyText >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <MyText h5 bold style={{ color: "#C3C6C9" }}>
                            Shipping
                        </MyText >
                        <MyText h5 bold style={{ color: "#C3C6C9" }}>
                            € {shipping_charge}
                        </MyText >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1, borderColor: "#D9D9D9", marginTop: 10 }}>
                        <MyText h4 bold style={{ color: "#000000" }}>
                            Total
                        </MyText >
                        <MyText h5 bold style={{ color: "#000000" }}>
                            € {Number(details?.price) + shipping_charge}
                        </MyText >
                    </View>

                </View>
                <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 8, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PinSvg width={34} height={34} />
                    <View style={{ width: "80%" }}>
                        <MyText h6 regular style={{ color: "#C3C6C9" }}>
                            Stimulated delivery in 3-7 days
                        </MyText >
                        <MyText h6 bold style={{ color: "#303030", marginVertical: 8 }}>
                            {address?.place}
                        </MyText >
                        <Pressable onPress={() => navigation.goBack()}>
                            <MyText h6 regular style={{ color: "#04CFA4" }}>
                                To Edit
                            </MyText >
                        </Pressable>

                    </View>
                </Pressable>
                <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    {/* <PersonSvg width={34} height={34} /> */}
                    <View style={{ width: "80%" }}>
                        <MyText h5 regular style={{ color: "#000" }}>
                            Select Payment method
                        </MyText >
                        <View style={{ marginTop: 12, gap: 25, width: "100%" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                                <Pressable onPress={() => setSelectPay("card")} style={{ width: 25, height: 25, borderWidth: 2, borderColor: "#04CFA4", borderRadius: 25 / 2, backgroundColor: selectPay == "card" ? "#04CFA4" : "#fff" }} />
                                <MyText h6 bold style={{ color: "#303030" }}>
                                    Card
                                </MyText >
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                                <Pressable onPress={() => setSelectPay("wallet")} style={{ width: 25, height: 25, borderWidth: 2, borderColor: "#04CFA4", borderRadius: 25 / 2, backgroundColor: selectPay == "wallet" ? "#04CFA4" : "#fff" }} />
                                <MyText h6 bold style={{ color: "#303030" }}>
                                    Wallet  ( {`€ ${Wallet}`} )
                                </MyText >
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                                <Pressable onPress={() => setSelectPay("cod")} style={{ width: 25, height: 25, borderWidth: 2, borderColor: "#04CFA4", borderRadius: 25 / 2, backgroundColor: selectPay == "cod" ? "#04CFA4" : "#fff" }} />
                                <MyText h6 bold style={{ color: "#303030" }}>
                                    COD
                                </MyText >
                            </View>
                        </View>
                    </View>
                </Pressable>
                <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PickSvg width={34} height={34} />
                    <View style={{ width: "80%" }}>
                        <MyText h6 regular style={{ color: "#C3C6C9" }}>
                            Promotional code
                        </MyText >

                        <MyText h6 regular style={{ color: "#04CFA4" }}>
                            To Edit
                        </MyText >
                    </View>
                </Pressable>
                <View style={{ backgroundColor: "#fff", marginVertical: 15 }}>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, elevation: 5 }}>
                        <View style={{ width: 133, height: 133, borderRadius: 12, overflow: "hidden" }}>
                            <Image source={{ uri: details.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                        </View>
                        <View style={{}}>
                            <MyText h4 bold style={{ color: "#1C1B1B" }}>
                                {details?.title}
                            </MyText >
                            <MyText h5 regular style={{ color: "#C3C6C9" }}>
                                Colour: Made Blue
                            </MyText >
                            <MyText h5 bold style={{ color: "#04CFA4" }}>
                                € {details?.price}
                            </MyText >
                        </View>
                    </View>
                </View>
                <MyButton onPress={() => selectPay == "card" ? payment_handler_web() : selectPay == "wallet" ? payment_wallet() : payment_handler()} loading={loading} title={"Continue"} style={{ borderRadius: 12 }} />

            </ScrollView>

        </View>
    )
}

export default Summary