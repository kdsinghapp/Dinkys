
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Image, TextInput, View, TouchableOpacity, Pressable, ScrollView, Text
} from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import { errorToast } from '../../utils/customToast'
import LogoSvg from "../../assets/svg/logo_white.svg"
import ArrowNext from "../../assets/svg/arrowNext.svg"
import MyStatusBar from '../../elements/MyStatusBar'
import localizationStrings from '../Localization/Localization'
import AsyncStorage from '@react-native-async-storage/async-storage'



const ChooseLanguage = ({ route }) => {
    const navigation = useNavigation()
    const [security, setSecurity] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [languageChanged, setLanguageChanged] = useState(false);
    const [loading, setLoading] = useState(false)



    const handleChangeLanguage = async (language) => {
        localizationStrings.setLanguage(language);
        await AsyncStorage.setItem("Lng", language)
        navigation.navigate("Login")
    };
    useEffect(() => {
        const handleLanguage = async () => {
            const language = await AsyncStorage.getItem("Lng")

            localizationStrings.setLanguage(language);

        }
        handleLanguage();
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
            <MyStatusBar backgroundColor={"#000"} barStyle={"ligh-content"} />
      <LogoSvg width={219.29} height={130} />
            <View style={{ justifyContent: "center", alignItems: "center", position: "absolute", bottom: 30, width: "90%" }}>
                <Text style={{ textAlign: "center", width: "50%", color: "#fff", fontWeight: '800', fontSize: 18 }}>
                  {localizationStrings.Choose_lng}
                </Text >
                <View style={{ marginTop: 20, }} >
                    <Pressable onPress={() => {
                        handleChangeLanguage('English')
                    }
                    } style={{ padding: 18, flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 15, justifyContent: "space-between", width: "100%" }}>
                        <Text bold h5 style={{ color: "#04CFA4", fontWeight: '700', fontSize: 16 }} >
                            English
                        </Text>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <ArrowNext width={20} height={20} />
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            handleChangeLanguage('Spanish')
                        }
                        }
                        style={{ padding: 18, flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 15, justifyContent: "space-between", width: "100%", marginTop: 20 }}>
                        <Text bold h5 style={{ color: "#04CFA4", fontWeight: '700', fontSize: 16 }} >
                            Spanish
                        </Text>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <ArrowNext width={20} height={20} />
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default ChooseLanguage




