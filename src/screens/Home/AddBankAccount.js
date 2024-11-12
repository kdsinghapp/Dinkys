/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, ScrollView } from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import Theme from '../../theme'
import { useSelector } from 'react-redux'
import HeaderTwo from '../../components/Header'
import { DOMAIN } from '../../services/Config'
import { errorToast, successToast } from '../../utils/customToast'

const AddBankDetails = ({ route }) => {
    const userDetails = useSelector((state) => state.user.user)
    const navigation = useNavigation()

    const [cardNumber, setCardNumber] = useState('')
    const [accountHolderName, setAccountHolderName] = useState('')
    const [bankCode, setBankCode] = useState('')
    const [swiftBicCode, setSwiftBicCode] = useState('')
    const [loading, setLoading] = useState(false)

    const _add_card = () => {
        if (!cardNumber || !accountHolderName || !bankCode || !swiftBicCode) {
            errorToast("Please enter all bank details", 3000)
        } else {
            setLoading(true)
            const formData = new FormData()
            formData.append("user_id", userDetails?.id)
            formData.append("acc_number", cardNumber)
            formData.append("holder_name", accountHolderName)
            formData.append("bank_code", bankCode)
            formData.append("code", swiftBicCode)

            const requestOptions = {
                method: "POST",
                body: formData,
                redirect: "follow"
            }

            fetch(`${DOMAIN}add_bank_account`, requestOptions)
                .then((response) => response.json())
                .then((res) => {
                    if (res.status === "1") {
                        successToast("Bank details added successfully", 3000)
                        navigation.navigate("BankDetails")
                    }
                })
                .catch((err) => {
                    console.log("Error:", err)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor="transparent" barStyle="dark-content" />
            <HeaderTwo navigation={navigation} title="Add Bank Details" />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
                <View>
                    <MyText semibold h5 style={{ color: "#000", marginVertical: 10 }}>Account Holder Name</MyText>
                    <TextInput
                        value={accountHolderName}
                        onChangeText={setAccountHolderName}
                        style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18 }}
                        placeholder="Account Holder Name"
                        placeholderTextColor="#979797"
                     
                    />

                    <MyText semibold h5 style={{ color: "#000", marginVertical: 10 }}>Account Number</MyText>
                    <TextInput
                        value={cardNumber}
                        keyboardType="numeric"
                        onChangeText={setCardNumber}
                        style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18 }}
                        placeholder="Account Number"
                        placeholderTextColor="#979797"
                    
                    />

                    <MyText semibold h5 style={{ color: "#000", marginVertical: 10 }}>Bank Code</MyText>
                    <TextInput
                        value={bankCode}
                        onChangeText={setBankCode}
                        style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18 }}
                        placeholder="Bank Code"
                        placeholderTextColor="#979797"
                    />

                    <MyText semibold h5 style={{ color: "#000", marginVertical: 10 }}>SWIFT/BIC Code</MyText>
                    <TextInput
                        value={swiftBicCode}
                        onChangeText={setSwiftBicCode}
                        style={{ backgroundColor: "#F8F8F8", borderRadius: 12, padding: 18 }}
                        placeholder="SWIFT/BIC Code"
                        placeholderTextColor="#979797"
                    />
                </View>

                <MyButton
                    loading={loading}
                    onPress={_add_card}
                    textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD }}
                    style={{ borderRadius: 30, width: "100%", alignSelf: "center", marginTop: 20 }}
                    title="Add"
                />
            </ScrollView>
        </View>
    )
}

export default AddBankDetails
