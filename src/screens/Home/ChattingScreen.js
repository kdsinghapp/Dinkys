
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Pressable, View, TextInput, ActivityIndicator, Image, FlatList, Text,
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import { useDispatch, useSelector } from 'react-redux'
import ProRight from "../../assets/svg/LeftArrow.svg"
import MenuSvg from "../../assets/svg/menu.svg"
import SendSvg from "../../assets/svg/Send.svg"
import Lock from "../../assets/svg/lock.svg"
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import { errorToast } from '../../utils/customToast'
import LinearGradient from 'react-native-linear-gradient'


const ChattingScreen = ({ navigation, route }) => {
    const { item, product } = route?.params
    const userDetails = useSelector((state) => state.user.user)
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [send, setsend] = useState('');

    console.log('product', product);
    useFocusEffect(
        React.useCallback(() => {
            _getChat();
        }, []),
    );

    const _getChat = () => {
        var formdata = new FormData();
        formdata.append('sender_id', userDetails?.id);
        formdata.append('receiver_id', item?.reciever_id);
        formdata.append('product_id', item?.product_id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-chat`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setChat(res?.result);
                } else {
                    setChat([])
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    };

    const InsertChat_api = () => {
        setLoading(true);
        var formdata = new FormData();
        formdata.append('sender_id', userDetails.id);
        formdata.append('receiver_id', item?.reciever_id);
        formdata.append('product_id', item?.product_id);
        formdata.append('chat_message', send);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch(`${DOMAIN}send-chat`, requestOptions)
            .then((response) => response.json())
            .then(res => {
                if (res.status == '1') {
                    _getChat();
                    setsend('');
                }
            })
            .catch(err => {
                console.log('err', err);
            })
            .finally(() => {
                setLoading(false);
                setsend('');
            });
    };
    const productImage = product?.product_images[0]?.image

    console.log('item',item);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <View style={{ flex: 1 }}>


                {/* 
            <>
            <View style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 25, justifyContent: "space-between" }}>
                    <Pressable onPress={() => navigation.goBack()} style={{marginLeft:-20}}>
                        <ProRight width={50} height={50} />
                    </Pressable>
                    <View style={{ width: 40, height: 40, }}>
                        <Image source={{ uri: productImage }} style={{ width: 40, height: 40, borderRadius: 40 / 2, }} />


                    </View>
                    <View style={{ width: "67%" }}>
                        <Text style={{ fontSize:14, color: '#000', fontWeight: '500' ,marginLeft:15}} >{product?.title?.substring(0, 30)}</Text>
                        <Text style={{ fontSize:12, color: '#949494', fontWeight: '500' ,marginLeft:15}} >{product?.product_location?.substring(0, 100)}</Text>
           
                    </View>
                    <MenuSvg width={80} height={80} />
                
                
                </View> 
                
            
            */}
    
            <View style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 25, justifyContent: "space-between" }}>
                    <Pressable onPress={() => navigation.goBack()} style={{marginLeft:-20}}>
                        <ProRight width={50} height={50} />
                    </Pressable>
                    <View style={{ width: 40, height: 40, }}>
                        <Image source={{ uri: item?.image }} style={{ width: 40, height: 40, borderRadius: 40 / 2, }} />


                    </View>
                    <View style={{ width: "67%" }}>
                        <Text style={{ fontSize:14, color: '#000', fontWeight: '500' ,marginLeft:15}} >{item?.name?.substring(0, 30)}</Text>
                       
           
                    </View>
                    <MenuSvg width={80} height={80} />
                
                
                </View> 
                
            
           



                <View style={{
                    height: 80, flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center', backgroundColor: "#F9F9F9",
                    alignSelf: 'center', width: '50%', borderRadius: 25, marginTop: 20
                }}>
                    <Lock />
                    <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: '500', color: '#000', width: '70%', marginLeft: 10 }}>For security reasons, never share private data</Text>

                </View>
                <FlatList
                    inverted
                    style={{ padding: 20, }}
                    keyExtractor={index => index?.id?.toString()}
                    data={chat}
                    renderItem={({ item }) => {
                        return (
                            <>
                                <View
                                    style={{
                                        alignSelf:
                                            item?.receiver_id === userDetails.id
                                                ? 'flex-start'
                                                : 'flex-end',
                                        marginVertical: 10,
                                        maxWidth: '80%',
                                    }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {item?.chat_message?.length === 0 ? null : (
                                            item.receiver_id !== userDetails.id ?
                                                <View
                                                    style={{ padding: 10, alignSelf: "flex-start", borderRadius: 12, backgroundColor: "#F6F6F6" }}>
                                                    <MyText
                                                        h6
                                                        regular
                                                        style={{
                                                            padding: 4,
                                                            color:
                                                                item?.receiver_id === userDetails.id
                                                                    ? '#000'
                                                                    : '#000000',
                                                        }}

                                                    >
                                                        {item?.chat_message}
                                                    </MyText>
                                                </View>
                                                :
                                                <LinearGradient
                                                    colors={['#0BD89E', '#0BD89E']}
                                                    start={{ x: 5, y: 0 }}
                                                    end={{ x: 0, y: 1 }}
                                                    style={{
                                                        padding: 5, paddingHorizontal: 15,
                                                        alignSelf: "flex-start", borderRadius: 12
                                                    }}>
                                                    <MyText
                                                        h6
                                                        regular
                                                        style={{
                                                            padding: 4,
                                                            color:
                                                                item?.receiver_id === userDetails.id
                                                                    ? '#fff'
                                                                    : '#fff',
                                                        }}
                                                    >
                                                        {item?.chat_message}
                                                    </MyText>
                                                </LinearGradient>
                                        )}
                                    </View>
                                </View>
                            </>
                        );
                    }}
                />
                <View style={{
                    backgroundColor: "#F3F4F5", borderRadius: 30,
                    flexDirection: "row", alignItems: "center", paddingVertical: 2,
                    paddingHorizontal: 12, justifyContent: "space-between", margin: 15
                }}>
                    {/* <AttachedSvg width={16} height={16} /> */}
                    <TextInput style={{ width: "75%", height: "100%" }}
                        value={send} onChangeText={(e) => setsend(e)} placeholder='Typing message...' />
                    {loading ? (
                        <ActivityIndicator size={'small'} />
                    ) : (
                        <Pressable
                            onPress={() =>
                                send?.length === 0
                                    ? errorToast('Please Me text', 3000)
                                    : InsertChat_api()
                            }>
                            <SendSvg width={40} height={40} />
                        </Pressable>
                    )
                    }
                </View>

            </View>

        </View >
    )
}

export default ChattingScreen