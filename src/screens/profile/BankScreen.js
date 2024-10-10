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


const BankScreen = ({ route }) => {
    const navigation = useNavigation()
    const userDetails = useSelector((state) => state.user.user)
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(false)



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
           <Text style={{fontSize:18,fontWeight:'600',color:"#000"}}>My Card</Text>

                <Pressable 
                onPress={()=>{
                    navigation.navigate('BankDetails')
                }}
                style={{position:'absolute',bottom:50,right:30}}>
                    <Image source={require('../../assets/dinkyimg/AddCard3x.png')}  style={{height:50,width:50,}}/>
                </Pressable>

                <View style={{marginTop:10}} />
                {loading ?
                    <View style={{ marginTop: 30, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                    :
                    account == null ? null :
                    <View style={styles.cardContainer}>
                    {/* Card Logo */}
                    <Image
                      source={require('../../assets/visa.png')}
                      style={styles.logo}
                    />
              
                    {/* Chip */}
                    <Image
                      source={require('../../assets/chip.png')}
                      style={styles.chip}
                    />
              
                    {/* Card Number */}
                    <Text style={styles.cardNumber}>**** **** **** {lastFourDigits}</Text>
              
                    {/* Cardholder Name */}
                    <Text style={styles.cardHolder}>{account?.card_holder_name}</Text>
              
                    {/* Expiry Date */}
                    <View style={styles.cardDetails}>
                      <Text style={styles.label}>Expiry</Text>
                      <Text style={styles.expiryDate}>{account?.expire_month}/{account?.expire_year}</Text>
                    </View>
                  </View>

                }

            </View >
        </View>

    )
}
const styles = StyleSheet.create({
    cardContainer: {
        alignSelf:'center',

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
export default BankScreen
