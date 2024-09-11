
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
import OrderSalesDetails from '../../components/OrderSalesDetails'
import Upside from "../../assets/svg/upside.svg"
import Theme from '../../theme'
import { hp } from '../../utils/Constant'
import MyButton from '../../elements/MyButton'


const Sales = ({ navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [show, setShow] = useState("wind")
    const [loading, setLoading] = useState(false)
    const [purchase, setPurchase] = useState([])
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(undefined)
    const [Expandable, setExpandable] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            _purchase_list()
        }, [show])
    )

    const _inprogressHandler = (id, status) => {
        setOpen(false)
        setLoading(true)
        var formdata = new FormData();
        formdata.append("product_id", id);
        formdata.append("status", status);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}change_product_status`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    _purchase_list()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

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
        fetch(`${DOMAIN}get-products-by-user-id`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    setPurchase(res?.products)
                } else {
                    setPurchase([])
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _add_card = () => {

    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Sales"} />
            <ScrollView contentContainerStyle={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
                <View style={{ backgroundColor: "#FBFBFB", flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => setShow("wind")} style={{ width: "33.33%", padding: 18, backgroundColor: show == "wind" ? "#04CFA4" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <MyText h6 semibold style={{ color: show == "wind" ? "#fff" : "#757575" }}>
                            In wind
                        </MyText >
                    </Pressable>
                    <Pressable onPress={() => setShow("inprogress")} style={{ width: "33.33%", padding: 18, backgroundColor: show == "inprogress" ? "#04CFA4" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <MyText h6 semibold style={{ color: show == "inprogress" ? "#fff" : "#757575" }}>
                            In progress
                        </MyText >
                    </Pressable>
                    <Pressable onPress={() => setShow("Complete")} style={{ width: "33.33%", padding: 18, backgroundColor: show == "Complete" ? "#04CFA4" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <MyText h6 semibold style={{ color: show == "Complete" ? "#fff" : "#757575" }}>
                            Finished
                        </MyText >
                    </Pressable>
                </View>
                {loading ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                    :
                    purchase?.length == 0 ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <MyText>No data here...</MyText>
                        </View>
                        :
                        <View style={{ flex: 1, width: "100%", 
                        
                    marginVertical: 20 }}>
                            {/* {purchase.map((item, index) => {
                                return (
                                    <Pressable
                                        onPress={() => { setOpen(true), setData(item) }}
                                        key={index}
                                        style={{
                                            width: "48%",
                                            borderRadius: 12,
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            shadowOffset: {
                                                height: 0,
                                                width: 0
                                            },
                                            backgroundColor: "#fff",
                                            elevation: 5,
                                            marginBottom: 15
                                        }}>
                                        <View style={{
                                            borderRadius: 12,
                                            backgroundColor: "#fff",
                                            height: 172,
                                            overflow: "hidden"
                                        }}>
                                            <Image source={{ uri: item?.product_images[0].image }} style={{
                                                width: "100%", height: "100%", borderTopLeftRadius: 12,
                                                borderTopRightRadius: 12,
                                            }} />
                                        </View>
                                        <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                                            <MyText h6 bold style={{ color: "#04CFA4" }}>
                                                € {item?.price}
                                            </MyText >
                                            <MyText h6 semibold style={{ color: "#000" }}>
                                                {item?.title}
                                            </MyText >
                                            <MyText h6 regular style={{ color: "#949494" }}>
                                                {item?.description}
                                            </MyText >
                                        </View>
                                    </Pressable>
                                )
                            })} */}


                            <FlatList
                                numColumns={2}
                                data={purchase}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => setExpandable(Expandable =>!Expandable)}

                                        key={index} style={{
                                            width: '98%',
                                            borderRadius: 12,
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            shadowOffset: {
                                                height: 0,
                                                width: 0
                                            },
                                            backgroundColor: "#fff",
                                            elevation: 5,
                                            margin: 5,
                                            marginBottom: 15
                                            ,

                                            padding: 10
                                        }}>
                                        <View style={{
                                            flexDirection: 'row',


                                            width: '100%',
                                            height: hp(14),
                                            alignItems: 'center', justifyContent: 'space-between'
                                        }}>
                                            <View style={{
                                                borderRadius: 12,
                                                backgroundColor: "#fff",
                                                height: 90, width: 90
                                            }}>
                                                <Image source={{ uri: item?.product_images[0].image }} style={{
                                                    width: 80, height: 80, borderRadius: 12,

                                                }} resizeMode='cover' />
                                            </View>
                                            <View style={{ backgroundColor: "#fff", width: '40%', height: '65%' }}>

                                                <Text style={{ color: "#04CFA4", fontSize: 14, fontWeight: '700' }}>
                                                    € {item?.price}
                                                </Text>


                                                <Text style={{ color: "#000", fontWeight: '600', fontSize: 12, marginTop: 10 }}>
                                                    {item?.title?.substring(0, 20)}
                                                </Text >
                                                <Text style={{ color: "#949494", fontWeight: '600', fontSize: 12, marginTop: 5 }}>
                                                    {item?.description?.substring(0, 25)}
                                                </Text >
                                            </View>
                                            <Pressable style={{
                                                backgroundColor: Theme.BUTTON_PRIMARY_COLOR, height: 40, borderRadius: 30,
                                                alignItems: 'center', justifyContent: 'center',
                                                width: '30%'
                                            }}  >

                                                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>In progress</Text>
                                            </Pressable>

                                        </View>

                                        {Expandable &&
                                            <>
                                                <View style={{ height: hp(28) }}>
                                                    <TouchableOpacity
                                                    onPress={()=>{
                                                        // navigation.navigate('Map',{details:item})
                                                    }}
                                                    >

                                                    <Image source={require('../../assets/dinkyimg/map3.png')} style={{
                                                        width: '100%', height: hp(15), borderRadius: 12,
                                                        
                                                    }} resizeMode='cover' />
                                                    </TouchableOpacity>

                                                    <MyButton loading={loading} onPress={_add_card} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD }} style={{ borderRadius: 15, marginVertical: 10, width: "100%", alignSelf: "center", marginTop: 20, }} title={"View Pickup Point"} />

                                                </View>

                                                <Pressable style={{ alignSelf: 'center', marginTop: 5 }}>
                                                    <Upside />
                                                </Pressable>

                                            </>
                                        }
                                    </TouchableOpacity>


                                )}
                            />
                        </View>
                }
            </ScrollView>
            <OrderSalesDetails
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                data={data}
                type={show}
                onDone={(e, v) => _inprogressHandler(e, v)}
            />
        </View>
    )
}

export default Sales