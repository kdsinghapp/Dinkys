
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    FlatList,
    Image, ImageBackground, Pressable, ScrollView, TextInput, View,
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import HeaderTwo from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
const Privacy = ({ navigation }) => {

    const [faqData, setFaqData] = useState([])
    const userDetailData = useSelector((state) => state.user.user)

    const token = userDetailData?.access_token
    useFocusEffect(
        React.useCallback(() => {
            _get_about()
        }, [])
    )
    const _get_about = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://api.dkyss.es/api/get-privacy-policy", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const res = JSON.parse(result)
                if (res?.status == '1') {
                    setFaqData(res?.data)

                }

            })

            .catch((error) => console.error(error));
    }





    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Privacy Policy"} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 0, padding: 20 }}>
         
                        <View>
                            <MyText h6 bold style={{ color: "#000000", marginVertical: 15 }}>
                                {faqData?.name}
                            </MyText >
                            <MyText h6 bold style={{ color: "#00000050", }}>
                                {faqData?.description}
                            </MyText >
                        </View>
                   
            </ScrollView>
        </View>
    )
}

export default Privacy