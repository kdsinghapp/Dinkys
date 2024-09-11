
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Image, TextInput, View, TouchableOpacity, Pressable, ScrollView
} from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import { errorToast } from '../../utils/customToast'
import LogoSvg from "../../assets/svg/logo_white.svg"
import ArrowNext from "../../assets/svg/arrowNext.svg"
import MyStatusBar from '../../elements/MyStatusBar'



const ChooseLanguage = ({ route }) => {
    const navigation = useNavigation()
    const [security, setSecurity] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const [loading, setLoading] = useState(false)

    const signInHandler = () => {
        if (name.length === 0) {
            errorToast("Please Enter Username")
        }
        //  else {
        //     setLoading(true)
        //     const data = {
        //         phone_number: number
        //     }
        //     signup(data).then((res) => {
        //         navigation.navigate("Otp", { data: number })
        //     }).catch((err) => {
        //         errorToast("User with this phone number already exists", 3000)
        //     }).finally(() => {
        //         setLoading(false)
        //     })
        // }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
            <MyStatusBar backgroundColor={"#000"} barStyle={"ligh-content"} />
            <LogoSvg width={219.29} height={94.67} />
            <View style={{ justifyContent: "center", alignItems: "center", position: "absolute", bottom: 30, width: "90%" }}>
                <MyText h4 bold style={{ textAlign: "center", width: "50%", color: "#fff" }}>
                    Choose the language familiar to you.
                </MyText >
                <View style={{ marginTop: 20, }} >
                    <Pressable onPress={() => navigation.navigate("Login")} style={{ padding: 18, flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 15, justifyContent: "space-between", width: "100%" }}>
                        <MyText bold h5 style={{ color: "#04CFA4" }} >
                            English
                        </MyText>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <ArrowNext width={20} height={20} />
                        </View>
                    </Pressable>
                    <Pressable style={{ padding: 18, flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 15, justifyContent: "space-between", width: "100%", marginTop: 20 }}>
                        <MyText bold h5 style={{ color: "#04CFA4" }} >
                            Spanish
                        </MyText>
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




