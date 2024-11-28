import React, { useState, useEffect } from 'react'
import {
    FlatList, Pressable, ActivityIndicator, Image, View,
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MyText from '../../elements/MyText'
import { useFocusEffect } from '@react-navigation/native'
import { get_notification } from '../../services/Auth'
import { useSelector } from 'react-redux'
import localizationStrings from '../Localization/Localization'
const Notification = () => {
    const userDetails = useSelector((state) => state.user.user)
    const navigation = useNavigation()
    const [notification, setNotification] = useState([])
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            _getNotification();
        }, []),
    );

    const _getNotification = () => {
        setLoading(true)
        get_notification(userDetails?.id).then((res) => {
            if (res?.status == "1") {
                setNotification(res?.result)
            } else {
                setNotification([])
            }
        }).catch((err) => {
            console.log("err", err)
        }).finally(() => {
            setLoading(false)

        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff", overflow: "hidden" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <View style={{ backgroundColor: "#fff", flex: 1, paddingHorizontal: 20 }}>
                <View style={{ backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                        <AntDesign name={"arrowleft"} size={25} color="#000" />
                    </Pressable>
                    <MyText h4 bold style={{ color: "#000" }}>
                        {localizationStrings.notification}
                    </MyText>
                    <Pressable style={{ padding: 10 }}>
                        <MaterialCommunityIcons name={"bell-badge-outline"} size={25} color="#fff" />
                    </Pressable>
                </View>

                {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={"small"} />
                </View>
                    :
                    <>
                        {notification.length === 0 ?
                            <View style={{ flex: 1, justifyContent: "center" }}><MyText h5 bold style={{ textAlign: "center", marginTop: 20 }} >No Data Here</MyText></View>
                            :
                            <FlatList
                                data={notification}
                                showsVerticalScrollIndicator={false}
                                style={{ flex: 1, marginTop: 15 }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => {
                                    console.log("other_user_image", item?.other_user_image)
                                    return (
                                        <Pressable
                                            // onPress={() => navigation.navigate("ChattinScreen", { item, imageData: { path: uri, filename: "image.png", mime: "image/png" } })}

                                            style={{ width: "100%", alignSelf: "center", flexDirection: "row", borderRadius: 20, marginBottom: 25, alignItems: "center" }}>
                                            <View
                                                style={{ width: 50, height: 50, borderRadius: 50 / 2, borderColor: "#000", justifyContent: "center", alignItems: "center", borderWidth: 1, overflow: "hidden", borderColor: "gray" }}
                                            >
                                                {/* <Image source={{ uri: item?.other_user_image }}
                                                    style={{ width: "100%", height: "100%" }}
                                                /> */}
                                                {item?.other_user_image == "https://www.stemsj.com/dental/uploads/images/" ? <Image source={require("../../../assets/Image/user.jpeg")} style={{ width: "60%", height: "60%" }} /> : <Image style={{ width: "100%", height: "100%" }} source={{ uri: item.other_user_image }} />}

                                            </View>
                                            <View style={{ marginLeft: 10, justifyContent: "center", width: "75%" }}>
                                                <MyText h4 semibold style={{ color: "#000" }}>
                                                    {item?.other_user_name}
                                                </MyText>
                                                <MyText numberOfline={1} h6 style={{ color: "#5A5A5A" }}>
                                                    {item?.notification}
                                                </MyText>
                                            </View>
                                        </Pressable>
                                    )
                                }}
                            />
                        }
                    </>
                }

            </View>
        </View>
    )
}

export default Notification