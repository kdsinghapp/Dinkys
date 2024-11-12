
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, Pressable, ScrollView, Image, Dimensions } from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import Theme from '../../theme'
import { useSelector } from 'react-redux'
import HeaderTwo from '../../components/Header'
import { DOMAIN } from '../../services/Config'
import { errorToast, successToast } from '../../utils/customToast'
const AddCardDetails = ({ route }) => {
    const userDetails = useSelector((state) => state.user.user)
    const navigation = useNavigation()
    const [cardnumber, setCardNumber] = useState()
    const [cvv, setCvv] = useState()
    const [month, setMonth] = useState()
    const [year, setYear] = useState()
    const [carName, setCarName] = useState()
    const [loading, setLoading] = useState(false)


    const _add_card = () => {
        if (!cardnumber || !month || !year || !carName) {
            errorToast("Please Enter Card Details", 3000)
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("user_id", userDetails?.id);
            formdata.append("card_number", cardnumber);
            formdata.append("expire_month", month);
            formdata.append("expire_year", year);
            formdata.append("cvv", cvv);
            formdata.append("card_holder_name", carName);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}add_account`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    console.log("res", res)
                    if (res.status == "1") {
                        successToast("Added Card Successfully", 3000)
                        navigation.navigate("BankDetails")
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
            <HeaderTwo navigation={navigation} title={"Add Card"} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
                <View>
                    <MyText semibold h5 style={{ color: "#000", marginVertical: 10 }} >Card Holder Name</MyText>
                    <TextInput maxLength={16} value={carName} keyboardType='numeric' onChangeText={(e) => setCarName(e)} style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18 }} placeholder='Enter card holder name' placeholderTextColor={"#979797"} />
                    <MyText semibold h5 style={{ color: "#000", marginVertical: 10 }} >Card Number</MyText>
                    <TextInput maxLength={16} value={cardnumber} keyboardType='numeric' onChangeText={(e) => setCardNumber(e)} style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18 }} placeholder='Enter 12 digit card number' placeholderTextColor={"#979797"} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 15 }} >
                        <MyText semibold h5 style={{ color: "#000", width: "60%" }} >Valid Thru</MyText>
                        <MyText semibold h5 style={{ color: "#000", width: "40%" }} >CVV</MyText>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }} >
                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center", width: "60%" }}>
                            <TextInput value={month} keyboardType='numeric' onChangeText={(e) => setMonth(e)} style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18, width: "42%", }} placeholder='Month' placeholderTextColor={"#979797"} />
                            <TextInput value={year} keyboardType='numeric' onChangeText={(e) => setYear(e)} style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18, width: "42%", }} placeholder='Year' placeholderTextColor={"#979797"} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", width: "40%" }}>
                            <TextInput maxLength={3} secureTextEntry={true}value={cvv} keyboardType='numeric' onChangeText={(e) => setCvv(e)} style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18, width: "80%", }} placeholder='Enter Cvv' placeholderTextColor={"#979797"} />
                        </View>
                    </View>
                     </View>

                <MyButton loading={loading} onPress={_add_card} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD }} style={{ borderRadius: 30, width: "100%", alignSelf: "center", marginTop: 20, }} title={"Add"} />

            </ScrollView >

        </View>)
}

export default AddCardDetails