
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, TouchableOpacity, Pressable, ScrollView, BackHandler, Alert } from 'react-native'
import MyText from '../../elements/MyText'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import { errorToast } from '../../utils/customToast'
import Theme from '../../theme'
import { useDispatch } from 'react-redux'
import EmailSvg from "../../assets/svg/Email.svg"
import PasswordSvg from "../../assets/svg/Password.svg"
import EyesSvg from "../../assets/svg/eye.svg"
import LogoSvg from "../../assets/svg/Logo_Black.svg"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DOMAIN } from '../../services/Config'
import { useFocusEffect } from '@react-navigation/native'



const Register = ({ route, navigation }) => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [number, setNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [deviceId, setDeviceId] = useState('');
    const dispatch = useDispatch()

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


    const signupHandler = () => {
        if (name.length == 0 || number.length == 0 || email.length == 0 || password.length == 0) {
            errorToast("Please Enter Number", 3000)
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("user_name", name);
            formdata.append("password", password);
            formdata.append("email", email);
            formdata.append("mobile", number);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}Register`, requestOptions)
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
                        {"Register"}
                    </MyText>
                    <MyText h5 regular style={{ color: "#9DB2BF", marginVertical: 5 }}>
                        {"Enter Your User Details"}
                    </MyText>
                </View>

                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 15, borderColor: name?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                    <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <EmailSvg width={24} height={24} />
                    </View>
                    <View style={{ width: "78%", backgroundColor: "#fff", }}>
                        <MyText semibold style={{ color: name?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0, fontSize: 14 }}>
                            {"Full Name"}
                        </MyText>
                        <TextInput value={name} keyboardType="default" onChangeText={(e) => setName(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Name' placeholderTextColor={"#000"} />
                    </View>
                </View>

                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 15, borderColor: number?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                    <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <MyText h5 semibold style={{ color: "#000", margin: 0, marginBottom: 0 }}>
                            {"+91"}
                        </MyText>
                    </View>
                    <View style={{ width: "78%", backgroundColor: "#fff", }}>
                        <MyText semibold style={{ color: number?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0, fontSize: 14 }}>
                            {"Phone Number"}
                        </MyText>
                        <TextInput value={number} keyboardType="numeric" onChangeText={(e) => setNumber(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Number' placeholderTextColor={"#000"} />
                    </View>
                </View>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginTop: 15, borderColor: email?.length == 0 ? "#D1D1D1" : "#04CFA4", borderWidth: 2, height: 60, padding: 4, justifyContent: "space-between" }}>
                    <View style={{ width: "18%", borderRightWidth: 2, borderRightColor: "#EBEBEB", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <EmailSvg width={24} height={24} />
                    </View>
                    <View style={{ width: "78%", backgroundColor: "#fff", }}>
                        <MyText semibold style={{ color: email?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0, fontSize: 14 }}>
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
                        <MyText semibold style={{ color: password?.length == 0 ? "#D1D1D1" : "#04CFA4", margin: 0, marginBottom: 0, fontSize: 14 }}>
                            {"Password"}
                        </MyText>
                        <TextInput value={password} secureTextEntry={true} keyboardType="default" onChangeText={(e) => setPassword(e)} style={{ fontFamily: Theme.FONT_FAMILY_REGULAR, fontSize: 10, color: "#000", height: 34 }} placeholder='Enter Your Password' placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ width: "15%", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <EyesSvg width={24} height={24} />
                    </View>
                </View>
                <MyButton onPress={signupHandler} loading={loading} textStyle={{ fontSize: 18, fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30, fontWeight: "800" }} style={{ borderRadius: 15, width: "100%", alignSelf: "center", marginVertical: 15 }} title={"Signup"} />
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
                            onPress={() => navigation.navigate("Login")}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 5,
                            }}>
                            <MyText h5 semibold style={{
                                color: '#04CFA4',
                            }}>
                                Log in
                            </MyText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView >
        </View>
    )
}

export default Register