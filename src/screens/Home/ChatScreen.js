
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View, FlatList, TouchableOpacity, TextInput, BackHandler } from 'react-native'
import MyText from '../../elements/MyText'
import { useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import Pig from "../../assets/svg/pig.svg"
import SearchSvg from "../../assets/svg/search.svg"

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

const ChatScreen = ({ navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [show, setShow] = useState("Products")
    const [chatList, setChatList] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchVal, setSearchVal] = useState('');
    const [filterData, setFilterData] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            _getChatC()
        }, [])
    )

    const _getChatC = () => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetails?.access_token}`);
        var formdata = new FormData();
        formdata.append("receiver_id", userDetails?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-conversation`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setChatList(res?.result)
                }
            }).catch((err) => {
                console.log("err", err)
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
        <View style={{ flex: 1, backgroundColor: "#fff" ,padding: 20, paddingTop: 5}}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo back={true} navigation={navigation} title={"Message"} />
            <ScrollView >
            <View style={{ backgroundColor: "#F3F4F5", width: "100%", borderRadius: 30, 
                height:52,
                flexDirection: "row", alignItems: "center", paddingHorizontal: 8, justifyContent: "space-between",
                 marginVertical: 12 }}>
                    <SearchSvg width={16} height={16} style={{ paddingLeft: 30 }} />
                    <TextInput value={searchVal} onChangeText={(e) => searchHandler(e)} placeholder='Search here...' style={{ width: "95%" }} />
                   
                </View>
                <View style={{ backgroundColor: "#FBFBFB", flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => setShow("Products")} style={{ width: "48%", padding: 18,
                     backgroundColor: show == "Products" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: show == "Products" ? "#fff" : "#757575",fontWeight:'600',fontSize:15 }}>
                            Message
                        </Text >
                    </Pressable>
                    <Pressable onPress={() => setShow("Searches")} style={{ width: "48%", padding: 18, backgroundColor: show == "Searches" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                
                        <Text style={{ color: show == "Searches" ? "#fff" : "#757575",fontWeight:'600',fontSize:15 }}>
                            Notification
                        </Text >
                    </Pressable>

                </View>
                {show == "Products" ?
                    <View style={{ width: "100%", marginTop: 20 }}>
                        <Text style={{ color: "#000",fontSize:22,fontWeight:'800' }}>Chat</Text>
                        {chatList?.length == 0 ? null
                            :
                            chatList.map((item, index) => {
                                return (
                                    <Pressable onPress={() => navigation.navigate("ChattingScreen", {
                                        item: {
                                            image: item?.image,
                                            name: item?.user_name,
                                            product_id: item?.product_id,
                                            reciever_id: item?.sender_id
                                        }
                                    })} key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", borderColor: "#949494", paddingVertical: 20 }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 40 / 2, backgroundColor: "#CACACA40" }}>
                                            <Image source={{ uri: item?.image }} style={{ width: "100%", height: "100%", borderRadius: 40 / 2, }} />
                                        
                                       
                                        </View>
                                        <View style={{ width: "78%" }}>
                                        <Text style={{fontSize:15,color:'#000',fontWeight:'700'}} >{item.user_name}</Text>
                                        <Text style={{fontSize:14,color:'#949494',fontWeight:'500'}} >{item?.last_message}</Text>
                                        </View>
                                        {/* <MyText h6 regular style={{ color: "#949494" }}>2 hours ago</MyText> */}
                                    </Pressable>
                                )
                            })}
                    </View>
                    :
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginVertical: 20 }}>
                        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                            return (
                                <View key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", borderColor: "#949494", paddingVertical: 20 }}>
                                    <View style={{ width: 60, height: 60, borderRadius: 40 / 2, backgroundColor: "#CACACA40" }}>
                                    
                                    <View style={{position:'absolute',top:10,left:5}}>
                                            <Pig  />
                                        </View>
                                    </View>
                                    <View style={{ width: "58%" ,marginLeft:10}}>
                                        <Text style={{fontSize:15,color:'#000',fontWeight:'700'}} >Mackbook</Text>
                                        <Text style={{fontSize:12,color:'#949494',fontWeight:'500'}} >RNemo enim  aspernatur</Text>
                                    </View>
                                    <Text style={{fontSize:14,color:'#949494',fontWeight:'500'}} >2 hours ago</Text>
                                </View>
                            )
                        })}
                    </View>
                }
            </ScrollView>

        </View>
    )
}

export default ChatScreen