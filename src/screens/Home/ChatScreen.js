
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
import localizationStrings from '../Localization/Localization'



const ChatScreen = ({ navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [show, setShow] = useState("Products")
    const [chatList, setChatList] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchVal, setSearchVal] = useState('');
    const [filterData, setFilterData] = useState([]);
    const[notificationList,setnotificationList] = useState([])
    useFocusEffect(
        React.useCallback(() => {
            _getChatC()
            get_notification_list()
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


    const get_notification_list =()=>{

        const token = userDetails?.access_token
        const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);

const formdata = new FormData();
formdata.append("user_id", userDetails?.id);

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: formdata,
  redirect: "follow"
};

fetch("https://panel.dkyss.es/api/get_notification", requestOptions)
  .then((response) => response.text())
  .then((result) => {

    console.log('result',result);
    const res = JSON.parse(result)

    if(res?.status){
        setnotificationList(res?.data)
    }
  

})
  .catch((error) => console.error(error));


  
    }

    const timeAgo = (dateString) => {
        const timeUnits = [
          { name: 'minute', seconds: 60 },
          { name: 'hour', seconds: 3600 },
          { name: 'day', seconds: 86400 },
          { name: 'week', seconds: 604800 },
          { name: 'month', seconds: 2592000 },  // Approximate (30 days)
          { name: 'year', seconds: 31536000 },  // Approximate (365 days)
        ];
      
        const updatedTime = new Date(dateString).getTime();
        const currentTime = new Date().getTime();
        const timeDifferenceInSeconds = (currentTime - updatedTime) / 1000;
      
        for (let i = timeUnits.length - 1; i >= 0; i--) {
          const unitSeconds = timeUnits[i].seconds;
          if (timeDifferenceInSeconds >= unitSeconds) {
            const timeValue = Math.floor(timeDifferenceInSeconds / unitSeconds);
            return `${timeValue} ${timeUnits[i].name}${timeValue > 1 ? 's' : ''} ago`;
          }
        }
      
        return "Just now";
      };
      console.log('chatList',chatList);
      
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" ,padding: 20, paddingTop: 5}}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo back={true} navigation={navigation} title={localizationStrings.message} />
            <ScrollView >
            <View style={{ backgroundColor: "#F3F4F5", width: "100%", borderRadius: 30, 
                height:52,
                flexDirection: "row", alignItems: "center", paddingHorizontal: 8, justifyContent: "space-between",
                 marginVertical: 12 }}>
                    <SearchSvg width={16} height={16} style={{ paddingLeft: 30 }} />
                    <TextInput value={searchVal} 
                    placeholderTextColor={'#000'}
                    onChangeText={(e) => searchHandler(e)} placeholder={localizationStrings.search_here} style={{ width: "95%" }} />
                   
                </View>
                <View style={{ backgroundColor: "#FBFBFB", flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => setShow("Products")} style={{ width: "48%", padding: 18,
                     backgroundColor: show == "Products" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: show == "Products" ? "#fff" : "#757575",fontWeight:'600',fontSize:15 }}>
                        {localizationStrings.message}
                        </Text >
                    </Pressable>
                    <Pressable onPress={() => setShow("Searches")} style={{ width: "48%", padding: 18, backgroundColor: show == "Searches" ? "#0BD89E" : "transparent", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                
                        <Text style={{ color: show == "Searches" ? "#fff" : "#757575",fontWeight:'600',fontSize:15 }}>
                        {localizationStrings.notification}
                        </Text >
                    </Pressable>

                </View>
                {show == "Products" ?
                    <View style={{ width: "100%", marginTop: 20 }}>
                        <Text style={{ color: "#000",fontSize:22,fontWeight:'800' }}>{localizationStrings.chats}</Text>
                        {chatList?.length == 0 ? null
                            :
                            chatList.map((item, index) => {
                                return (
                                    <Pressable onPress={() => navigation.navigate("ChattingScreen", {
                                        item: {
                                            image: item?.image,
                                            name: item?.user_name,
                                            product_id: item?.product_id,
                                            reciever_id: item?.sender_id,
                                            label:item?.label

                                        }
                                    })} key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", borderColor: "#949494", paddingVertical: 20 }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 40 / 2, backgroundColor: "#CACACA40" }}>
                                            <Image source={{ uri: item?.image }} style={{ width: "100%", height: "100%", borderRadius: 40 / 2, }} />
                                        
                                       
                                        </View>
                                        <View style={{ width: "78%" }}>
                                        <Text style={{fontSize:15,color:'#000',fontWeight:'700'}} >{item.user_name} {item?.name?.substring(0, 30)}  {item?.label === 'professional'&&<Image source={require('../../assets/verified.png')}  style={{height:20,width:20,marginLeft:20}} />}</Text>
                                        <Text style={{fontSize:14,color:'#949494',fontWeight:'500'}} >{item?.last_message}</Text>
                                        </View>
                                        {/* <MyText h6 regular style={{ color: "#949494" }}>2 hours ago</MyText> */}
                                    </Pressable>
                                )
                            })}
                    </View>
                    :
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginVertical: 20 }}>
                        {notificationList?.map((item, index) => {
                            return (
                                <View key={index} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", borderColor: "#949494", paddingVertical: 20 }}>
                                    <View style={{alignItems:'center',justifyContent:'center', width: 60, height: 60, borderRadius: 40 / 2, backgroundColor: "#CACACA40" }}>
                                    
                                  
                                            <Pig  height={80} />
                                     
                                    </View>
                                    <View style={{ width: "58%" ,marginLeft:10}}>
                                        <Text style={{fontSize:15,color:'#000',fontWeight:'700'}} >{item?.title}</Text>
                                        <Text style={{fontSize:12,color:'#949494',fontWeight:'500'}} >{item?.body}</Text>
                                    </View>
                                    <Text style={{fontSize:14,color:'#949494',fontWeight:'500'}} >{timeAgo(item?.updated_at)}</Text>
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