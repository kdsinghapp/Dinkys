/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Pressable, Image, View, TouchableOpacity, TextInput, ScrollView, ImageBackground, FlatList
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import AccirdianItem from '../../components/AccordianItem'
import HeaderTwo from '../../components/Header'
import { get_faq } from '../../services/Auth'
import { useFocusEffect } from '@react-navigation/native'

const Data = [
    {
        id:1,
        question:"What services do you offer?",
        answer:"Hi"
    },
    {
        id:2,
        question:"How can I get a quote for your services?",
        answer:"Hi"
    },
    {
        id:3,
        question:"What industries do you cater to?",
        answer:"Hi"
    },
    {
        id:4,
        question:"How can I contact your customer support?",
        answer:"Hi"
    },
    {
        id:5,
        question:"What is your refund policy?",
        answer:"Hi"
    },
    {
        id:6,
        question:"How long does it take to complete a project?",
        answer:"Hi"
    },
]

const FAQ = ({ route }) => {
    const navigation = useNavigation()
    const [faqData, setFaqData] = useState([])
    // useFocusEffect(
    //     React.useCallback(() => {
    //         _get_faq()
    //     }, [])
    // )
    // const _get_faq = () => {
    //     get_faq()
    //         .then((res) => {
    //             if (res?.status == "1") {
    //                 setFaqData(res?.result)
    //             }
    //         }).catch((err) => {
    //             console.log("err", err)
    //         })
    // }

    return (
        <View style={{ flex: 1, backgroundColor:"#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={"FAQ"} navigation={navigation} />
            <View style={{ flex: 1, padding: 20 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={Data}
                    keyExtractor={(item, index) => index?.toString()}
                    style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent", marginBottom: 30 }}
                    renderItem={({ item }) => (
                        <AccirdianItem title={item?.question} des={item?.answer} />
                    )
                    }
                />
            </View >
        </View>

    )
}

export default FAQ
