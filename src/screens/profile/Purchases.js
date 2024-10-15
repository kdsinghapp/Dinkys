
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, Text, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator } from 'react-native'
import MyText from '../../elements/MyText'
import { useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import OrderDetails from '../../components/OrderDetails'
import Theme from '../../theme'

import Shipment from "../../assets/svg/shipment.svg"
import { successToast } from '../../utils/customToast'


const Purchases = ({ navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [show, setShow] = useState("Complete")
    const [loading, setLoading] = useState(false)
    const [purchase, setPurchase] = useState([])
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(undefined)
    const [ProductData, setProductData] = useState(null)
    const currentDate = new Date();
    useFocusEffect(
        React.useCallback(() => {
            _purchase_list()
        }, [show])
    )


    console.log('purchase',purchase);
    const _purchase_list = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        formdata.append("status", show);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}order_list`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    setPurchase(res?.result)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const getYear = (date) => {
        return date.getFullYear();
    };
    const getMonthName = (date) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[date.getMonth()];
    };

    function formatDate(timestamp) {
        const date = new Date(timestamp);
    
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
        const month = months[date.getMonth()];
        const day = date.getDate();
        const dayName = days[date.getDay()];
    
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    
        return `${month} ${day}, ${dayName} ${hours}:${minutes}:${seconds} ${ampm}`;
      }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Purchases"} />
       
                <View style={{ backgroundColor: "#FBFBFB", flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => setShow("Pending")} style={{
                        width: "48%", padding: 18,
                        backgroundColor: show == "Pending" ? Theme.BUTTON_PRIMARY_COLOR : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10
                    }}>
                        <Text style={{ color: show == "Pending" ? "#fff" : "#757575", fontWeight: '600', fontSize: 16 }}>
                            Ongoing
                        </Text >
                    </Pressable>
                    <Pressable onPress={() => setShow("Complete")}
                        style={{
                            width: "48%", padding: 18,
                            backgroundColor: show == "Complete" ? Theme.BUTTON_PRIMARY_COLOR : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10
                        }}>
                        <Text style={{ color: show == "Complete" ? "#fff" : "#757575", fontWeight: '600', fontSize: 16 }}>
                            Completed
                        </Text >
                    </Pressable>
                   

                </View>
                <ScrollView contentContainerStyle={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
                {show == "Complete" ?
                    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                        :
                        purchase?.length == 0 ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <MyText>No data here...</MyText>
                        </View>
                            :

                            <>

                                <View style={{ padding: 10, marginTop: 20 }}>
                                    <Text style={{ fontSize: 19, color: '#000', fontWeight: '800' }}>{getYear(currentDate)}</Text>
                                    <Text style={{ fontSize: 16, color: '#000', fontWeight: '800' }}>{getMonthName(currentDate)}</Text>
                                </View>

                                <View style={{ width: "100%", marginTop: 20 }}>
                                    {purchase?.map((item, index) => {
                                        return (
                                            <Pressable 
                                            onPress={() => { setOpen(true), 
                                                setProductData(item?.seller_data)
                                                setData(item?.order_id) }}
                                            key={index} style={{

                                                alignItems: "center", backgroundColor: "#fff",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginVertical: 15,
                                                borderBottomWidth: 0.5,
                                                paddingBottom: 20,
                                                borderColor: "#949494"
                                            }}>
                                                <View style={{
                                                    borderRadius: 12,
                                                    backgroundColor: "#fff",
                                                    height: 60, width: 90
                                                }}>
                                                    <Image source={{ uri: item?.product_data?.product_images?.[0].image }} style={{
                                                        width: 60, height: 60, borderRadius: 12,

                                                    }} resizeMode='cover' />
                                                </View>
                                                <View style={{ width: "60%", marginLeft: -15 }}>
                                                    <Text style={{ color: "#000", fontSize: 16, fontWeight: '700' }}>
                                                        {item?.product_data?.title?.substring(0, 20)}
                                                    </Text >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                        <Shipment />
                                                        <Text style={{ color: "#C3C6C9", fontWeight: '500', fontSize: 12, marginLeft: 5 }}>
                                                            Shipment
                                                        </Text>
                                                    </View>
                                                    <Text style={{ color: "#C3C6C9", fontWeight: '500', fontSize: 12, marginTop: 5 }}>
                                                        Completed on {formatDate(item.updated_at)}
                                                    </Text >
                                                </View>
                                                <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 14, width: "20%", }}>
                                                    ${item?.total_amount}.00
                                                </Text >
                                            </Pressable>
                                        )
                                    })}
                                </View>


                            </>
                    :
                    loading ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size={"small"} />
                        </View>
                        :
                        purchase?.length == 0 ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <MyText>No data here...</MyText>
                        </View>
                            :
                            <View style={{ width: "100%", marginTop: 20 }}>
                                {purchase?.map((item, index) => {
                                    return (
                                        <Pressable onPress={() => {  
                                             setProductData(item?.seller_data) 
                                            setOpen(true), 
                                            setData(item?.order_id) }}

                                            key={index} style={{
                                                width: "100%", backgroundColor: '#fff',
                                                borderRadius: 15, padding: 10, flexDirection: "row", alignItems: "center", gap: 12, elevation: 5, marginBottom: 15
                                            }}>
                                            <View style={{ width: 100, height: 100, borderRadius: 12, overflow: "hidden" }}>
                                                <Image source={{ uri: item?.product_data?.product_images?.[0].image }}
                                                    style={{ width: "100%", height: "100%" }} />
                                            </View>
                                            <View style={{}}>
                                                <Text style={{ color: "#000", fontSize: 16, fontWeight: '700' }}>
                                                    {item?.product_data?.title}
                                                </Text >
                                                <Text style={{ color: "#C3C6C9", fontSize: 12, fontWeight: '600' }}>
                                                    Colour: {item.product_data.color}
                                                </Text >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                    <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 14 }}>
                                                        ${item?.total_amount}
                                                    </Text >
                                                    {/* <Text style={{
                                                        color: "#949494", marginLeft: 20,
                                                        fontWeight: '700', fontSize: 12, textDecorationLine: 'line-through'
                                                    }}>
                                                        $465.00
                                                    </Text > */}
                                                </View>
                                            </View>

                                            <View style={{ position: 'absolute', right: 15, top: 10 }}>
                                                <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 14 }}>
                                                    Ongoing
                                                </Text >
                                            </View>
                                        </Pressable>
                                    )
                                })}
                            </View>
                }

            </ScrollView>
            <OrderDetails
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                data={data}
                type={show}
                productData={ProductData}
            />
        </View>
    )
}

export default Purchases