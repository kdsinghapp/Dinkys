
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Image, TextInput, View, TouchableOpacity, Pressable, ScrollView
} from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import { errorToast } from '../../utils/customToast'
import Theme from '../../theme'
import { forgot_password, recovery_api } from '../../services/Auth'
import EmailSvg from "../../assets/svg/Email.svg"
import LogoSvg from "../../assets/svg/Logo_Black.svg"
import BackNav from "../../assets/svg/BackNav.svg"
import { DOMAIN } from '../../services/Config'
import Mobile from "../../assets/svg/gMobile.svg"
import localizationStrings from '../Localization/Localization'

const ResetPassByNumber = ({ route }) => {
    const { showNumber } = route?.params
    const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [number, setNumber] = useState("")

    const forgotPassword = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append('email_phone', email || number);
        formdata.append('type', showNumber ? "phone" : "email");
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}Password-Reset`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                console.log("res", res)
                if (res.status == "1") {
                    navigation.navigate("Otp", { showNumber, email, number })
                } else {
                    errorToast(res.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <View style={{ flex: 1, padding: 20, }}>
                <Pressable onPress={() => navigation.goBack()} style={{ width: "100%", height: 60, }}>
                    <BackNav width={32} height={32} />
                </Pressable>
                <View style={{ width: "100%", justifyContent: "center" }}>
                    <MyText h3 bold style={{ color: "#000" }}>
                    {localizationStrings.reset_passowrd}
                    </MyText>
                    <MyText h5 regular style={{ color: "#9DB2BF", marginVertical: 5 }}>
                        {localizationStrings.password_txt}
                    </MyText>
                </View>
                {showNumber ?
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 35, borderColor: number?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                        <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Mobile width={30} height={30} />
                      
                        </View>
                        <View style={{ width: "78%", backgroundColor: "#fff", }}>
                            <MyText semibold h6 style={{ color: number?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                               {localizationStrings.enter_number}
                            </MyText>
                            <TextInput value={number} keyboardType="default" onChangeText={(e) => setNumber(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder= {localizationStrings.enter_number} placeholderTextColor={"#000"} />
                        </View>
                    </View>
                    :
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 35, borderColor: email?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2 ,height:70, padding: 4, justifyContent: "space-between" }}>
                        <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <EmailSvg width={30} height={30} />
                        </View>
                        <View style={{ width: "78%", backgroundColor: "#fff", }}>
                            <MyText semibold h6 style={{ color: email?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                               {localizationStrings.email}
                            </MyText>
                            <TextInput value={email} keyboardType="default" onChangeText={(e) => setEmail(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 14,paddingVertical:5,   color: "#000", height: 34 }} placeholder={localizationStrings.enter_email} placeholderTextColor={"#000"} />
                        </View>
                    </View>
                }
            </View >
            <MyButton loading={loading} onPress={forgotPassword} textStyle={{ fontSize: 18, fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30, fontWeight: "800" }} style={{ borderRadius: 15, width: "95%", alignSelf: "center", margin: 5 }} title={localizationStrings.submit} />
        </View>
    )
}

export default ResetPassByNumber