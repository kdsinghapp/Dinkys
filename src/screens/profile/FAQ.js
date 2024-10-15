/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Pressable, Image, View, TouchableOpacity, TextInput, ScrollView, ImageBackground, FlatList, Text
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import AccirdianItem from '../../components/AccordianItem'
import HeaderTwo from '../../components/Header'
import { ge_faq, get_faq } from '../../services/Auth'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'

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
    const userDetailData = useSelector((state) => state.user.user)

const token = userDetailData?.access_token
    useFocusEffect(
        React.useCallback(() => {
            _get_faq()
        }, [])
    )
    const _get_faq = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        
        fetch("https://api.dkyss.es/api/get-fqa", requestOptions)
          .then((response) => response.text())
          .then((result) => {
             const res = JSON.parse(result)
          if(res?.status == '1'){
            setFaqData(res?.data)
            console.log('result?.data',res?.data);
          }
            
          })
          
          .catch((error) => console.error(error));
    }

    return (
        <View style={{ flex: 1, backgroundColor:"#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={"FAQ"} navigation={navigation} />
            <View style={{ flex: 1, padding: 20 }}>
               {faqData?.length > 0 ? <FlatList
                    showsVerticalScrollIndicator={false}
                    data={faqData}
                    keyExtractor={(item, index) => index?.toString()}
                    style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent", marginBottom: 30 }}
                    renderItem={({ item }) => (
                        <AccirdianItem title={item?.qus} des={item?.ans} />
                    )
                    }
                />:
                <View>

                    <Text style={{fontSize:24,color:'#000',fontWeight:'600'}}>No FAQ Founded</Text>
                    </View>
                }
            </View >
        </View>

    )
}

export default FAQ
