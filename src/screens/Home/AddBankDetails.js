/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import RechargeSvg from "../../assets/svg/Recharge.svg"
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'


const BankDetails = ({ route }) => {
    const navigation = useNavigation()
    const userDetails = useSelector((state) => state.user.user)
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [BankAccount, setBankAccount] = useState(null)



    useFocusEffect(
        React.useCallback(() => {
            _accountDetails()
           

        }, [])
    )
    const _accountDetails = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_my_account`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                console.log("res", res)
                if (res.status == "1") {
                    setAccount(res?.result)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }


  
    const lastFourDigits = account?.card_number.slice(-4);
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={"Bank Details"} navigation={navigation} />
            <View style={{ flex: 1, padding: 20 }}>
                <Pressable onPress={() => navigation.navigate("AddCardDetails")} style={{
                    height: 206, width: "100%",
                    borderRadius: 15, elevation: 5, backgroundColor: "#e7fbf5", justifyContent: "center", alignItems: "center"
                }}>
                    <Text style={{ color: "#000", fontWeight: '600', fontSize: 18 }}>Credit or debit card</Text>
                    <RechargeSvg width={41} height={41} style={{ marginTop: 20 }} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("AddBankDetails")}
                    style={{
                        height: 206, width: "100%", borderRadius: 15, elevation: 5,

                        backgroundColor: "#e7fbf5", justifyContent: "center", alignItems: "center", marginTop: 20
                    }}>
                    <Text style={{ color: "#000", fontWeight: '600', fontSize: 18 }}>Bank Account</Text>
                    <RechargeSvg width={41} height={41} style={{ marginTop: 20 }} />
                </Pressable>
            </View >
        </View>

    )
}
const styles = StyleSheet.create({
    cardContainer: {
        alignSelf: 'center',

        width: '85%',
        height: 200,
        backgroundColor: '#1e1e1e',
        borderRadius: 15,
        padding: 20,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    logo: {
        width: 50,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        top: 20,
        right: 20,
    },
    chip: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginTop: 30,
    },
    cardNumber: {
        fontSize: 20,
        letterSpacing: 2,
        color: '#fff',
        marginTop: 10,
    },
    cardHolder: {
        fontSize: 16,
        color: '#fff',
        textTransform: 'uppercase',
        marginTop: 15,
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    label: {
        fontSize: 12,
        color: '#bbb',
    },
    expiryDate: {
        fontSize: 16,
        color: '#fff',
    },
});
export default BankDetails
