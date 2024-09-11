
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator, Text } from 'react-native'
import MyText from '../../elements/MyText'
import { get_doctorList } from '../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import Bag from "../../assets/svg/bag.svg"
import SearchSvg from "../../assets/svg/search.svg"
import Heart from "../../assets/svg/Heart2.svg"
import CameraSvg from "../../assets/svg/camera.svg"
import { useFocusEffect } from '@react-navigation/native'
import { errorToast } from '../../utils/customToast'
import { DOMAIN } from '../../services/Config'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Home = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [loading, setLoading] = useState(false)
    const [doctorData, setDoctorData] = useState([])
    const [searchVal, setSearchVal] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState([]);
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()


    useFocusEffect(
        React.useCallback(() => {
            _get_allCatergories()
            _get_product()
            _get_profile()
        }, [])
    )

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
                    dispatch({ type: "WALLET", payload: res?.data?.wallet });
                    setUser(res?.data)
                }
            }).catch((err) => {
                console.log("err", err)
            })
    }



    const _get_product = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("category_id", "");
        const requestOptions = {
            method: "POST",
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_products`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setProduct(res?.category)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _get_allCatergories = () => {
        setLoading(true)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_category`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setCategories(res?.data)
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const searchHandler = value => {
        if (value) {
            const newData = doctorData.filter(item => {
                const itemData = item?.unique_id
                    ? item?.unique_id.toUpperCase()
                    : ''.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterData(newData);
            setSearchVal(value);
        } else {
            setFilterData(doctorData);
            setSearchVal(value);
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: "#fff",padding: 20 }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <ScrollView  showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: "#fff",
                
                flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5 }}>
                    <Pressable style={{ paddingVertical: 10 }}>
                        <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 25 }}>
                            Welcome
                        </Text >
                        <Text style={{ color: "#666666", fontWeight: '700', fontSize: 18 }}>
                            {user?.user_name}
                        </Text >
                    </Pressable>
                    <View style={{ flexDirection: "row", justifyContent: "center", gap: 15, alignItems: "center" }}>
                        <Pressable
                            onPress={() => {

                                if(user?.driver_register && user?.driver_details){
                                    navigation.navigate('TabNavigator')
                                }

                                else if(!user?.driver_details && user?.driver_register ){
                                    navigation.navigate('VehicleDetails')
                                }
                                else{

                                    navigation.navigate('DeliveryScreen')
                                }
                               // navigation.navigate('DeliveryScreen')
                            }}
                            style={{ paddingVertical: 10 }}>
                            <Image source={require('../../assets/dinkyimg/truck.png')} style={{ width: 30, height: 30 }} />
                        </Pressable>
                        <Pressable style={{ paddingVertical: 10 }}>
                            <Bag width={28} height={28} />
                        </Pressable>
                        <Pressable style={{ width: 40, height: 40, borderWidth: 0.5, borderRadius: 40 / 2 }}>
                            {user?.image?.length === 0 ? null : <Image source={{ uri: user?.image }} style={{ width: "100%", height: "100%", borderRadius: 40 / 2 }} />}
                        </Pressable>
                    </View>
                </View>
                <View style={{ backgroundColor: "#F3F4F5", width: "100%", borderRadius: 30, 
                height:52,
                flexDirection: "row", alignItems: "center", paddingHorizontal: 8, justifyContent: "space-between",
                 marginVertical: 12 }}>
                    <SearchSvg width={16} height={16} style={{ paddingLeft: 30 }} />
                    <TextInput value={searchVal} onChangeText={(e) => searchHandler(e)} placeholder='Search here...' style={{ width: "75%" }} />
                    <CameraSvg width={40} height={40} />
                </View>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                    <Text style={{ color: "#1C1B1B", fontWeight: '700', fontSize: 18 }}>
                        Categories
                    </Text >
                    <Pressable onPress={() => navigation.navigate("AllCategories", { categories })} style={{ paddingVertical: 10 }}>
                        <Text style={{ color: "#04CFA4", fontWeight: '600', fontSize: 13 }}>
                            View All
                        </Text >
                    </Pressable>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        alignItems: 'center',
                        width: "100%",
                        backgroundColor: "#fff",
                        marginVertical: 15
                    }}>
                    {loading ? <View style={{ width: "100%", alignItems: "center" }}><ActivityIndicator size={"small"} /></View>
                        :
                        categories?.length == 0 ? null
                            :
                            categories?.slice(3)?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("ProductList", { item })}
                                        key={index}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: "25%",
                                            marginLeft:5,
                                            height: 60
                                        }}>
                                        <Image source={{ uri: item?.image }} style={{ width:30, height: 30 }} resizeMode='contain'/>
                                        <Text regular style={{ color: "#000", textAlign: "center", fontSize: 10, fontWeight: '600', height: 40,marginTop:8 }} >{item?.category_name?.substring(0,20)}</Text>
                                    </TouchableOpacity>
                                )
                            })
                    }
                </View>
                <Text style={{ color: "#1C1B1B", fontWeight: '700', fontSize: 18 }}>
                    Recent items
                </Text >
                <View style={{ flex:1}}>
                    {/* {product?.length == 0 ? null
                        :
                        product.map((item, index) => {
                            return (
                                item?.user_id == userDetailData?.id ? null
                                    :
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
                                            height:150,
                                            overflow: "hidden"
                                        }}>
                                            <Image source={{ uri: item?.product_images?.[0]?.image }} style={{
                                                width: "100%", height: "100%", borderTopLeftRadius: 12,
                                                borderTopRightRadius: 12,
                                            }} />
                                        </View>
                                        <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>

                                            <Text style={{ color: "#04CFA4", fontSize: 14, fontWeight: '700' }}>
                                                € {item?.price}
                                            </Text >
                                            <Heart />
                                        </View>
                                            <Text style={{ color: "#000",fontWeight:'600',fontSize:12 }}>
                                                {item?.title?.substring(0,20)}
                                            </Text >
                                            <Text style={{ color: "#949494",fontWeight:'600',fontSize:12 }}>
                                                {item?.description?.substring(0,25)}
                                            </Text >
                                        </View>
                                    </Pressable>

                            )
                        })} */}

                        <FlatList  
                        numColumns={2}
                        data={product}
                        renderItem={({item,index})=>(
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
                                height:150,
                                overflow: "hidden"
                            }}>
                                <Image source={{ uri: item?.product_images?.[0]?.image }} style={{
                                    width: "100%", height: "100%", borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                }} />
                            </View>
                            <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>

                                <Text style={{ color: "#04CFA4", fontSize: 14, fontWeight: '700' }}>
                                    € {item?.price}
                                </Text >
                                <Heart />
                            </View>
                                <Text style={{ color: "#000",fontWeight:'600',fontSize:12 }}>
                                    {item?.title?.substring(0,20)}
                                </Text >
                                <Text style={{ color: "#949494",fontWeight:'600',fontSize:12 }}>
                                    {item?.description?.substring(0,25)}
                                </Text >
                            </View>
                        </Pressable>
                        )}
                        />
                </View>
            </ScrollView>

        </View>
    )
}

export default Home