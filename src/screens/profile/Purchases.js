
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator } from 'react-native'
import MyText from '../../elements/MyText'
import { useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import OrderDetails from '../../components/OrderDetails'


const Data = [
    {
        id: 1,
        name: "iPhone 11 pro ",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ032m4BO7E0ceS_SM0cRiMgn9uAIHzLbBmA&s",
        amt: "29.00"
    },
    {
        id: 2,
        name: "Motorcycle jacket ",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUildVeakfCBxylFDyisGCtQ7fyxw20lHWug&s",
        amt: "60.00"

    },
    {
        id: 3,
        name: "Quad bike ",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPjdPd2FnNTIDDHweeN7kv0tY1v-QlA_y6gw&s",
        amt: "200.00"

    },
    {
        id: 4,
        name: "electric kettle",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTJkLYR0zoJgI1cKiigWOTI8BUtmZol6ctQ&s",
        amt: "29.00"

    }
]

const Purchases = ({ navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [show, setShow] = useState("Complete")
    const [loading, setLoading] = useState(false)
    const [purchase, setPurchase] = useState([])
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(undefined)
    
    useFocusEffect(
        React.useCallback(() => {
            _purchase_list()
        }, [show])
    )

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

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Purchases"} />
            <ScrollView contentContainerStyle={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
                <View style={{ backgroundColor: "#FBFBFB", flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => setShow("Complete")} style={{ width: "48%", padding: 18, backgroundColor: show == "Complete" ? "#04CFA4" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <MyText h6 semibold style={{ color: show == "Complete" ? "#fff" : "#757575" }}>
                            Completed
                        </MyText >
                    </Pressable>
                    <Pressable onPress={() => setShow("Pending")} style={{ width: "48%", padding: 18, backgroundColor: show == "Pending" ? "#04CFA4" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <MyText h6 semibold style={{ color: show == "Pending" ? "#fff" : "#757575" }}>
                            Ongoing
                        </MyText >
                    </Pressable>

                </View>
                {show == "Complete" ?
                    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                                        <View key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", marginVertical: 15, borderBottomWidth: 0.5, paddingBottom: 20, borderColor: "#949494" }}>
                                            <View style={{ width: 60, height: 60, borderRadius: 20 / 2, backgroundColor: "#CACACA40" }}>
                                            </View>
                                            <View style={{ width: "65%" }}>
                                                <MyText h5 bold>Liner</MyText>
                                                <MyText h6 regular>Recharge Jan 10</MyText>
                                            </View>
                                            <MyText h6 bold style={{ color: "#04CFA4" }}>$ {item?.total_amount}</MyText>
                                        </View>
                                    )
                                })}
                            </View>
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
                                        <Pressable onPress={() => { setOpen(true), setData(item?.order_id) }} key={index} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, elevation: 5, marginBottom: 15 }}>
                                            <View style={{ width: 133, height: 133, borderRadius: 12, overflow: "hidden" }}>
                                                <Image source={{ uri: item?.product_data?.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                                            </View>
                                            <View style={{}}>
                                                <MyText h4 bold style={{ color: "#1C1B1B" }}>
                                                    {item?.product_data?.title}
                                                </MyText >
                                                <MyText h5 regular style={{ color: "#C3C6C9" }}>
                                                    Colour: Made Blue
                                                </MyText >
                                                <MyText h5 bold style={{ color: "#04CFA4" }}>
                                                    $ {item?.total_amount}
                                                </MyText >
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
            />
        </View>
    )
}

export default Purchases