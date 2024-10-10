import { View, Text, TouchableOpacity, Image, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'
import Ratting from '../Delivery/Ratting'
import ChatIcon from "../../assets/svg/chaticon.svg"
import { DOMAIN } from '../../services/Config'
import Heart from "../../assets/svg/Heart2.svg"
import HeartColorSvg from "../../assets/svg/heartColor.svg"
import { useSelector } from 'react-redux'
export default function UserProfile() {
    const route = useRoute()
    const [loading, setLoading] = useState(false)
    const { item } = route.params
    const [product, setProduct] = useState([]);
    const navigation = useNavigation()
    const [Saller, setSeller] = useState(null)
    const userDetailData = useSelector((state) => state.user.user)
    const [user, setUser] = useState(null)
    useEffect(() => {
        _get_seller()
    }, [item])
    useEffect(()=>{
        _get_profile()
    },[user])
    const _get_profile = () => {

        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-profile`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                   
                    setUser(res?.data)
                }
            }).catch((err) => {
                console.log("err", err)
            })
    }

    const _get_seller = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("profile_id", item.id);
        formdata.append("user_id", user?.id);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}getProfiledatabyid`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setSeller(res?.result)
                    setProduct(res?.result.products)

                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const _Add_favprofile = (id) => {

        var formdata = new FormData();
        formdata.append("user_id", user?.id);
        formdata.append("profile_id", item.id);


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        fetch(`${DOMAIN}addFavProfile`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _get_seller()
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
            <HeaderTwo navigation={navigation} title={"User Details"} />
            <View

                style={{
                    width: "100%",
                    borderRadius: 30,
                    alignItems: 'center',
                    marginVertical: 18, gap: 10
                }}>
                <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "#04CFA433", overflow: "hidden" }} >
                    <Image source={{ uri: Saller?.image }} style={{ width: "100%", height: "100%" }} />
                </View>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={{
                        color: "#1C1B1B", textAlign: 'center',
                        fontSize: 18, fontWeight: '800'
                    }}>
                        {Saller?.user_name}
                    </Text >
                    <Text style={{
                        color: "#C9C9C9", textAlign: 'center',
                        fontSize: 14, fontWeight: '800'
                    }}>
                        {Saller?.email}
                    </Text >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5, marginTop: 5 }}>
                        <Ratting Ratting={Saller?.rating} />
                        <Text style={{ color: "#000", fontSize: 12, fontWeight: '600', marginLeft: 10 }}>
                            ({Saller?.rating})
                        </Text >
                    </View>
                    <TouchableOpacity

                
                        style={{
                            marginTop: 10, backgroundColor: '#fff',
                            flexDirection: 'row', paddingHorizontal: 15, height: 35, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,

                            elevation: 5,
                            borderRadius: 30, width: 160, alignItems: 'center', justifyContent: 'space-between'
                        }}
                        onPress={() => {_Add_favprofile() }}>
                        <Text style={{ fontSize: 14, color: '#000', fontWeight: '700' }}>Favorite user</Text>
                       {Saller?.profile_status ?<HeartColorSvg />:<Heart width={25} height={25} />}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ padding: 20 }}>
                <Text style={{
                    color: "#1C1B1B",
                    fontSize: 18, fontWeight: '600'
                }}>
                    Address
                </Text >
                <Text style={{
                    color: "grey",
                    fontSize: 14, fontWeight: '600'
                }}>{Saller?.address}
                </Text >

            </View>
            <View style={{ padding: 20 }}>
                <Text style={{
                    color: "#1C1B1B",
                    fontSize: 18, fontWeight: '600',
                    marginVertical: 10
                }}>
                    Products
                </Text >
                {product?.length > 0 ? <FlatList
                    numColumns={2}
                    data={product}
                    renderItem={({ item, index }) => (
                        <Pressable
                            onPress={() => navigation.navigate("ProductDetails", { item })}
                            key={index} style={{
                                width: "46%",
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
                            }}>
                            <View style={{
                                borderRadius: 12,
                                backgroundColor: "#fff",
                                height: 150,
                                overflow: "hidden"
                            }}>
                                <Image source={{ uri: item?.product_images?.[0]?.image }} style={{
                                    width: "100%", height: "100%", borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                }} />
                            </View>
                            <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <Text style={{ color: "#04CFA4", fontSize: 14, fontWeight: '700' }}>
                                        € {item?.price}
                                    </Text >
                                    <Heart />
                                </View>
                                <Text style={{ color: "#000", fontWeight: '600', fontSize: 12 }}>
                                    {item?.title?.substring(0, 20)}
                                </Text >
                                <Text style={{ color: "#949494", fontWeight: '600', fontSize: 12 }}>
                                    {item?.description?.substring(0, 25)}
                                </Text >
                            </View>
                        </Pressable>
                    )}
                /> :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600', marginTop: 60 }}>No Product Founded</Text>
                    </View>
                }

            </View>


        </View>
    )
}