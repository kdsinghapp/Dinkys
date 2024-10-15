
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert,Text, View, FlatList, TouchableOpacity, TextInput, BackHandler } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import PinSvg from "../../assets/svg/pin.svg"
import Offer from "../../assets/svg/offer.svg"
import Shield from "../../assets/svg/shield.svg"
import Truck from "../../assets/svg/truck.svg"
import MyButton from '../../elements/MyButton'
import HeaderTwo from '../../components/Header'
import { DOMAIN } from '../../services/Config'
import { useSelector } from 'react-redux'
import { errorToast, successToast } from '../../utils/customToast'
import MapPickerModal from '../../components/MapPicker'

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
        if ((Number(details?.price) + Number(shipping_charge)) > Wallet) {
         return   errorToast("Please Add Money in wallet")
        }
        
        else {
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
                        <Text  style={{ color: "#000000",fontWeight:'700',fontSize:16 }}>
                            {details?.title}
                        </Text >
                        <Text  style={{ color: "#000000",fontWeight:'700',fontSize:16 }}>
                            € {details?.price}.00
                        </Text >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 8 }}>
                       <View style={{flexDirection:'row',alignItems:'center'}}>
<Shield />
                        <Text h5 bold style={{marginLeft:10, color: "#C3C6C9",fontWeight:'700',fontSize:12  }}>
                            ROT Protection Fee
                        </Text >
                       </View>
                        <Text h5 bold style={{ color: "#C3C6C9",fontWeight:'700',fontSize:12  }}>
                            € 0.00
                        </Text >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
<Truck />
                    <Text h5 bold style={{marginLeft:10, color: "#C3C6C9",fontWeight:'700',fontSize:12  }}>
                            Shipping charges
                        </Text >
                        </View>
                        <Text h5 bold style={{ color: "#C3C6C9",fontWeight:'700',fontSize:12  }}>
                            € {shipping_charge}
                        </Text >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1, borderColor: "#D9D9D9", marginTop: 10 }}>
                      
                      <View style={{width:'50%'}}>
                        <Text  style={{ color: "#000000",fontSize:18,fontWeight:'700' }}>
                   Total
                        </Text >
                        </View>
                        <Text style={{ color: "#000000",fontSize:24,fontWeight:'700' }}>
                            € {Number(details?.price) + Number(shipping_charge)}
                        </Text >
                    </View>

                </View>
                <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 8, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PinSvg width={34} height={34} />
                    <View style={{ width: "80%" }}>
                        <MyText h6 regular style={{ color: "#6d6d6e" }}>
                            Stimulated delivery in {details?.estimate_delivery_days} days
                        </MyText >
                        <Text style={{ color: "#6d6d6e", marginVertical: 8,fontSize:12,fontWeight:'600', }}>
                            {address?.place}
                        </Text >
                        {/* <Pressable onPress={() => navigation.goBack()}>
                            <Text style={{ color: "#04CFA4",fontWeight:'500',fontSize:14 }}>
                                To Edit
                            </Text >
                        </Pressable> */}

                    </View>
                </Pressable>
                <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    {/* <PersonSvg width={34} height={34} /> */}
                    <View style={{ width: "80%" }}>
                        <Text style={{ color: "#000",fontSize:18,fontWeight:'600' }}>
                            Select Payment method
                        </Text >
                        <View style={{ marginTop: 12, gap: 25, width: "100%" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                                <Pressable onPress={() => setSelectPay("card")} 
                                style={{ width: 25, height: 25, borderWidth: 2,
                                 borderColor: selectPay == "card" ?"#000":"#04CFA4", borderRadius: 25 / 2, backgroundColor: selectPay == "card" ? "#04CFA4" : "#fff" }} />
                                <Text  style={{ color: "#303030",fontSize:16,fontWeight:'700' }}>
                                    Card
                                </Text >
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                        
                                <Pressable onPress={() => setSelectPay("wallet")} 
                                style={{ width: 25, height: 25, borderWidth: 2, 
                                borderColor: selectPay == "wallet" ?"#000":"#04CFA4",
                                borderRadius: 25 / 2, 
                                backgroundColor: selectPay == "wallet" ? "#04CFA4" : "#fff" }} />
                                <Text  style={{ color: "#303030",
                                
                                fontSize:16,fontWeight:'700' }}>
                                    Wallet  ( {`€ ${Wallet}`} )
                                </Text >
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                                <Pressable onPress={() => setSelectPay("cod")}
                                style={{ width: 25, height: 25, 
                                borderWidth: 2,
                                 borderColor: selectPay == "cod"?'#000' :"#04CFA4",
                                 borderRadius: 25 / 2, backgroundColor: selectPay == "cod" ? "#04CFA4" : "#fff" }} />
                                <Text  style={{ color: "#303030",fontSize:16,fontWeight:'700' }}>
                                    COD
                                </Text >
                            </View>
                        </View>
                    </View>
                </Pressable>
                <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <Offer width={34} height={34} />
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
                        <View style={{ width: 100, height: 100, borderRadius: 12, overflow: "hidden" }}>
                            <Image source={{ uri: details.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                        </View>
                        <View style={{}}>
                            <Text  style={{ color: "#000",fontSize:18,fontWeight:'800' }}>
                                {details?.title}
                            </Text >
                            <Text style={{ color: "#C3C6C9",fontWeight:'500',marginTop:10 }}>
                                Colour: Made Blue
                            </Text >
                            <Text h5 bold style={{ color: "#04CFA4" ,fontWeight:'700',fontSize:18}}>
                                € {details?.price}
                            </Text >
                        </View>
                    </View>
                </View>
                <View   style={{height:20}}/>
                <MyButton
                 onPress={() => selectPay == "card" ? payment_handler_web() : selectPay == "wallet" ? payment_wallet() : payment_handler()} loading={loading} title={"Continue"} style={{ borderRadius: 12 }} />
<View   style={{height:40}}/>
            </ScrollView>
      </View>
    )
}

export default Summary