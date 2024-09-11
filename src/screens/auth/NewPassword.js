
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
import { recovery_api } from '../../services/Auth'
import EmailSvg from "../../assets/svg/Password.svg"
import BackNav from "../../assets/svg/BackNav.svg"
import { DOMAIN } from '../../services/Config'


const NewPassword = ({ route }) => {
    const { userId } = route?.params
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [cPassword, setCpassword] = useState("")

    const forgotPassword = () => {
        if (password.length === 0 || cPassword?.length == 0) {
            errorToast("All Field Required", 3000)
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append('user_id', userId);
            formdata.append('password', password);
            formdata.append('confirm_password', cPassword);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}change-password`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.status == "1") {
                        navigation.navigate("Login")
                    } else {
                        errorToast(res?.statusmsg, 3000)
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
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
                        {"Create New Password"}
                    </MyText>
                    <MyText h5 regular style={{ color: "#9DB2BF", marginVertical: 5 }}>
                        {`Your new password must be different from previous used passwords.`}
                    </MyText>
                </View>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 35, borderColor: password?.length == 0 ? "#D1D1D1" : "#2172F7", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                    <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <EmailSvg width={30} height={30} />
                    </View>
                    <View style={{ width: "78%", backgroundColor: "#fff", }}>
                        <MyText semibold h6 style={{ color: password?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                            {"Password"}
                        </MyText>
                        <TextInput secureTextEntry={true} value={password} keyboardType="default" onChangeText={(e) => setPassword(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Password' placeholderTextColor={"#000"} />
                    </View>
                </View>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 20, borderColor: password?.length == 0 ? "#D1D1D1" : "#2172F7", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                    <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <EmailSvg width={30} height={30} />
                    </View>
                    <View style={{ width: "78%", backgroundColor: "#fff", }}>
                        <MyText semibold h6 style={{ color: cPassword?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                            {"Confirm Password"}
                        </MyText>
                        <TextInput value={cPassword} secureTextEntry={true} keyboardType="default" onChangeText={(e) => setCpassword(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Confirm Password' placeholderTextColor={"#000"} />
                    </View>
                </View>
            </View >
            <MyButton loading={loading} onPress={forgotPassword} textStyle={{ fontSize: 18, fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30, fontWeight: "800" }} style={{ borderRadius: 15, width: "95%", alignSelf: "center", margin: 5 }} title={"Submit"} />
        </View>
    )
}

export default NewPassword