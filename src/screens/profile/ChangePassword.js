
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, Pressable, ScrollView, Image } from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import Theme from '../../theme'
import { connect, useSelector } from 'react-redux'
import HeaderTwo from '../../components/Header'
import NewPassword from '../auth/NewPassword'
import { errorToast, successToast } from '../../utils/customToast'
import { DOMAIN } from '../../services/Config'
import localizationStrings from '../Localization/Localization'
const ChangePassword = ({ route }) => {
    const userDetails = useSelector((state) => state.user.user)
    const navigation = useNavigation()
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const _change_password = () => {
        if (password.length === 0 || newPassword?.length == 0) {
            errorToast("All Field Required", 3000)
        } else if (newPassword !== ConfirmPassword) {

        } else {
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${userDetails?.access_token}`);
            var formdata = new FormData();
            formdata.append('old_password', password);
            formdata.append('password', newPassword);
            formdata.append('confirm_password', ConfirmPassword);
            const requestOptions = {
                method: "POST",
                body: formdata,
                headers: myHeaders,
                redirect: "follow"
            };
            fetch(`${DOMAIN}change-password-auth`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.status == "1") {
                        successToast("Password Changed Succesfully", 3000)
                        navigation.navigate("Bottomtab")
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title= {localizationStrings.change_password} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
                <View style={{
                    paddingHorizontal: 12, paddingVertical: 5,
                    height: 65,
                    borderWidth: 1, borderColor: "#04CFA4", borderRadius: 15
                }}>
                    <MyText h6 bold style={{ color: "#04CFA4" }}>
                    {localizationStrings.current_pass}
                    </MyText >
                    <TextInput secureTextEntry={true} value={password} keyboardType="default" onChangeText={(e) => setPassword(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='*****' placeholderTextColor={"#000"} />
                </View>
                <View style={{
                    paddingHorizontal: 12, paddingVertical: 5, marginTop: 20,
                    height: 65,
                    borderWidth: 1, borderColor: "#04CFA4", borderRadius: 15
                }}>
                    <MyText h6 bold style={{ color: "#04CFA4" }}>
                    {localizationStrings.new_password}
                    </MyText >
                    <TextInput secureTextEntry={true} value={newPassword} keyboardType="default" onChangeText={(e) => setNewPassword(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='*****' placeholderTextColor={"#000"} />
                </View>

                <View style={{
                    paddingHorizontal: 12, paddingVertical: 5, marginTop: 20,
                    height: 65,
                    borderWidth: 1, borderColor: "#04CFA4", borderRadius: 15
                }}>
                    <MyText h6 bold style={{ color: "#04CFA4" }}>
                    {localizationStrings.confirm_password}
                    </MyText >
                    <TextInput secureTextEntry={true} value={ConfirmPassword} keyboardType="default" onChangeText={(e) => setConfirmPassword(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='*****' placeholderTextColor={"#000"} />
                </View>
            </ScrollView >
            <MyButton loading={loading} onPress={_change_password} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30 }} style={{ borderRadius: 16, width: "95%", alignSelf: "center", margin: 10 }} title={localizationStrings.save} />

        </View>)
}

export default ChangePassword