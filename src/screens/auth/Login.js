
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, TouchableOpacity, Pressable, ScrollView, BackHandler, Alert } from 'react-native'
import MyText from '../../elements/MyText'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import Theme from '../../theme'
import { useDispatch } from 'react-redux'
import EmailSvg from "../../assets/svg/Email.svg"
import PasswordSvg from "../../assets/svg/Password.svg"
import EyesSvg from "../../assets/svg/eye.svg"
import LogoSvg from "../../assets/svg/Logo_Black.svg"
import GoogleSvg from "../../assets/svg/google.svg"
import FacebookSvg from "../../assets/svg/Facebook.svg"
import MobileSvg from "../../assets/svg/mobile.svg"
import SMSSvg from "../../assets/svg/sms.svg"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { errorToast } from '../../utils/customToast'
import { DOMAIN } from '../../services/Config'
import { useFocusEffect } from '@react-navigation/native'

const Login = ({ route, navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [number, setNumber] = useState("")
    const [showNumber, setShowNumber] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deviceId, setDeviceId] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const response = await AsyncStorage.getItem('fcmToken');
                let parsed = JSON.stringify(response);
                let parsedMain = JSON.parse(parsed);
                setDeviceId(parsedMain);
            })();
        }, []),
    );

    const dispatch = useDispatch()
    const loginHandler = () => {
        if (password?.length == 0) {
            errorToast("All Fields Required", 3000)
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("email", showNumber ? number : email);
            formdata.append("password", password);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}Login`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.status == "1") {
                        dispatch({ type: 'SET_USER', payload: res?.data || {} });
                        dispatch({ type: "WALLET", payload: res?.data?.wallet });
                        await AsyncStorage.setItem('@USER', JSON.stringify(res?.data));
                        updateProfile(res?.data)
                    } else {
                        errorToast(res?.message, 3000)
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }


    const updateProfile = (userDetails) => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetails?.access_token}`);
        var formdata = new FormData();
        formdata.append('user_id', userDetails?.id);
        formdata.append('device_token', deviceId);

        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`${DOMAIN}update-profile`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    navigation.navigate("Bottomtab")
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
                setEmail("")
                setPassword("")
                setNumber("")
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <ScrollView style={{ padding: 20, marginBottom: 20 }}>
                <View style={{ width: "100%", height: 180, justifyContent: "center", alignItems: "center" }}>
                    <LogoSvg width={219.29} height={94.67} />
                </View>
                <View style={{ width: "100%", justifyContent: "center" }}>
                    <MyText h4 bold style={{ color: "#000" }}>
                        {"Login"}
                    </MyText>
                    <MyText h5 regular style={{ color: "#9DB2BF", marginVertical: 5 }}>
                        {`Enter Your ${showNumber ? "Phone Number" : "Email"}`}
                    </MyText>
                </View>
                {showNumber ?
                    <>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 5, borderColor: number?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                            <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                {/* <EmailSvg width={30} height={30} /> */}
                                <MyText h5 semibold style={{ color: "#000", margin: 0, marginBottom: 0 }}>
                                    {"+91"}
                                </MyText>
                            </View>
                            <View style={{ width: "78%", backgroundColor: "#fff", }}>
                                <MyText semibold h6 style={{ color: number?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                                    {"Phone Number"}
                                </MyText>
                                <TextInput value={number} keyboardType="default" onChangeText={(e) => setNumber(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Number' placeholderTextColor={"#000"} />
                            </View>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 15, borderColor: password?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                            <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <PasswordSvg width={24} height={24} />
                            </View>
                            <View style={{ width: "58%", backgroundColor: "#fff", }}>
                                <MyText semibold h6 style={{ color: password?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                                    {"Password"}
                                </MyText>
                                <TextInput value={password} secureTextEntry={true} keyboardType="default" onChangeText={(e) => setPassword(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 12, color: "#000", height: 34 }} placeholder='Enter Your Password' placeholderTextColor={"#000"} />
                            </View>
                            <View style={{ width: "15%", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <EyesSvg width={24} height={24} />
                            </View>
                        </View>
                    </>
                    :
                    <>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 5, borderColor: email?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                            <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <EmailSvg width={24} height={24} />
                            </View>
                            <View style={{ width: "78%", backgroundColor: "#fff", }}>
                                <MyText semibold h6 style={{ color: email?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0, }}>
                                    {"Email"}
                                </MyText>
                                <TextInput value={email} keyboardType="default" onChangeText={(e) => setEmail(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Email' placeholderTextColor={"#000"} />
                            </View>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 15, borderColor: password?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                            <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <PasswordSvg width={24} height={24} />
                            </View>
                            <View style={{ width: "58%", backgroundColor: "#fff", }}>
                                <MyText semibold h6 style={{ color: password?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0 }}>
                                    {"Password"}
                                </MyText>
                                <TextInput value={password} secureTextEntry={true} keyboardType="default" onChangeText={(e) => setPassword(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Password' placeholderTextColor={"#000"} />
                            </View>
                            <View style={{ width: "15%", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <EyesSvg width={24} height={24} />
                            </View>
                        </View>
                    </>
                }
                <Pressable onPress={() => navigation.navigate("ResetPassByNumber", { showNumber })} >
                    <MyText h5 regular style={{ color: "#000000", marginVertical: 10 }}>
                        Reset Password ?
                    </MyText >
                </Pressable>
                <MyButton loading={loading} onPress={loginHandler} textStyle={{ fontSize: 18, fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30, fontWeight: "800" }} style={{ borderRadius: 15, width: "100%", alignSelf: "center", marginVertical: 8 }} title={"Login"} />
                {/* <MyText h4 semibold style={{ textAlign: "center", color: "#000000", marginVertical: 18 }}>
                    Or
                </MyText > */}
                {/* <Pressable style={{ width: "100%", padding: 18, borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                    <GoogleSvg width={24} height={24} />
                    <MyText h5 semibold style={{ color: "#00000054" }}>
                        Login with Google
                    </MyText >
                </Pressable>
                <Pressable style={{ width: "100%", padding: 18, borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15, marginVertical: 15 }}>
                    <FacebookSvg width={24} height={24} />
                    <MyText h5 semibold style={{ color: "#00000054" }}>
                        Login with Facebook
                    </MyText >
                </Pressable> */}
                <Pressable onPress={() => setShowNumber(!showNumber)} style={{ width: "100%", padding: 18, borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                    {showNumber ? <SMSSvg width={24} height={24} /> : <MobileSvg width={24} height={24} />}
                    <MyText h5 semibold style={{ color: "#00000054" }}>
                        {showNumber ? "Login with Email" : "Sign up with Phone"}
                    </MyText >
                </Pressable>
                <View
                    style={{
                        alignItems: 'center',
                        width: "100%",
                        justifyContent: "center",
                        marginVertical: 20
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                        <MyText h6 regular style={{
                            color: '#000',
                        }}>
                            Don’t have an account?
                        </MyText>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Register")}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 5,
                            }}>
                            <MyText h5 semibold style={{
                                color: '#04CFA4',
                            }}>
                                Sign up
                            </MyText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView >
        </View>
    )
}

export default Login