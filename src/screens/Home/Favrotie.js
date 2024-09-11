
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, Text } from 'react-native'
import MyText from '../../elements/MyText'
import { useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import FavroiteSvg from "../../assets/svg/FavoritesColor.svg"
import CloseSvg from "../../assets/svg/Close.svg"
import HeaderTwo from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import Ratting from '../Delivery/Ratting'

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

const Favrotie = ({ navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [show, setShow] = useState("Products")
    const [loading, setLoading] = useState(false)
    const [doctorData, setDoctorData] = useState([])
    const [searchVal, setSearchVal] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [favData, setFavData] = useState([]);


    console.log('favData',favData);
    useFocusEffect(
        React.useCallback(() => {
            get_fav()
        }, [show])
    )

    const get_fav = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-favourite-products`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                console.log("res", res)
                if (res.status == "1") {
                    setFavData(res?.favourites)
                } else {
                    setFavData([])
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
            <HeaderTwo back={true} navigation={navigation} title={"Favrotie"} />
            <ScrollView style={{ backgroundColor: "#fff", flex: 1, padding: 20, paddingTop: 5 }}>
                <View style={{ backgroundColor: "#FBFBFB", flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => setShow("Products")} style={{ width: "33.33%", padding: 18, backgroundColor: show == "Products" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text  style={{ color: show == "Products" ? "#fff" : "#757575",fontSize:14,fontWeight:'700' }}>
                            Products
                        </Text >
                    </Pressable>
                    <Pressable onPress={() => setShow("Searches")} style={{ width: "33.33%", padding: 18, backgroundColor: show == "Searches" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: show == "Searches" ? "#fff" : "#757575" ,fontSize:14,fontWeight:'700' }}>
                            Searches
                        </Text >
                    </Pressable>
                    <Pressable onPress={() => setShow("Profile")} style={{ width: "33.33%", padding: 18, backgroundColor: show == "Profile" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: show == "Profile" ? "#fff" : "#757575" ,fontSize:14,fontWeight:'700' }}>
                            Profile
                        </Text >
                    </Pressable>
                </View>
                {show == "Products" ?
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginVertical: 20 }}>
                        {favData?.length == 0 ? null
                            :
                            <FlatList  
                            numColumns={2}
                            data={favData}
                            renderItem={({item,index})=>(
                                <Pressable
                                onPress={() => navigation.navigate("ProductDetails", { item:{...item?.product_data,product_images:item?.product_images }})}
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
                                        € {item?.product_data.price}
                                    </Text >
                                  <FavroiteSvg /> 
                                </View>
                                    <Text style={{ color: "#000",fontWeight:'600',fontSize:12 }}>
                                        {item?.product_data.title?.substring(0,20)}
                                    </Text >
                                    <Text style={{ color: "#949494",fontWeight:'600',fontSize:12 }}>
                                        {item?.product_data.description?.substring(0,25)}
                                    </Text >
                                </View>
                            </Pressable>
                            )}
                            />
                          }
                    </View>
                    :
                    show == "Profile" ?
                        <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
                            {Data.map((item, index) => {
                                return (
                                    <Pressable
                                        onPress={() => navigation.navigate("ProductDetails", { item })}
                                        key={index} style={{
                                            width: "98%",
                                            borderRadius: 20,
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
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            backgroundColor: "#fff",
                                            height: 220,
                                            padding:10,
                                            borderRadius:15,
                                            overflow: "hidden"
                                        }}>
                                            <Image source={{ uri: item?.img }} style={{
                                                width: "100%", height: "100%", borderTopLeftRadius: 12,
                                                borderRadius: 12,
                                            }}
                                            
resizeMode='contain'                                            />
                                        </View>
                                        <View style={{ justifyContent: "center", backgroundColor: "#fff", padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 20 }}>
                                            <View style={{ width: 50, height: 50, borderRadius: 50 / 2, borderWidth: 0.5 }} />
                                            <View style={{ width: "68%" }}>
                                                <Text style={{ color: "#000",
                                                fontSize:15,fontWeight:'600' }}>
                                                    {item?.name}
                                                </Text >
                                               <View style={{flexDirection:'row',marginLeft:-8,marginTop:5,
                                               alignItems:'center'}}>
                                             
                                             <Ratting Ratting={4} />
                                               <Text style={{ color: "#000",
                                               marginLeft:10,
                                               fontSize:10,fontWeight:'600' }}>
                                                   4.5 (2,495 reviews)
                                                </Text >
                                               </View>
                                            </View>
                                            <FavroiteSvg width={24} height={24} />
                                        </View>
                                    </Pressable>

                                )
                            })}
                        </View>
                        :
                        <View style={{ width: "100%", gap: 15, marginTop: 20, padding: 5 }}>
                            {[1, 2, 3, 4].map((item, index) => {
                                return (
                                    <Pressable
                                        key={index} style={{
                                            width: "100%",
                                            borderRadius: 20,
                                            shadowOpacity: 0.8,
                                            shadowRadius: 0.5,
                                            shadowOffset: {
                                                height: 0,
                                                width: 0
                                            },
                                            backgroundColor: "#fff",
                                            elevation: 5,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: 12,
                                            paddingHorizontal:15,
                                            margin: 2,
                                        }}>
                                        <View style={{ width: "72%" }}>
                                            <Text style={{ color: "#000",fontWeight:'700',fontSize:14 }}>
                                                iphone gadgets
                                            </Text >
                                            <Text style={{ color: "#949494",fontSize:10,fontWeight:'700' ,marginTop:5}}>
                                                Home & Garden. WC2R 2...
                                            </Text >
                                        </View>
                                        <CloseSvg width={24} height={24} />
                                    </Pressable>
                                )
                            })}
                        </View>
                }
            </ScrollView>

        </View>
    )
}

export default Favrotie