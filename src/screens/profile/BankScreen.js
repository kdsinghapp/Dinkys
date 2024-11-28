/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import RechargeSvg from "../../assets/svg/Recharge.svg"
import { useSelector } from 'react-redux'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import { successToast } from '../../utils/customToast'
import { hp } from '../../utils/Constant'
import localizationStrings from '../Localization/Localization'


const BankScreen = ({ route }) => {
  const navigation = useNavigation()
  const userDetails = useSelector((state) => state.user.user)
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(false)


  const [BankAccount, setBankAccount] = useState(null)


  const isFocus = useIsFocused()
  useFocusEffect(
    React.useCallback(() => {
      _accountDetails()
      _bankaccountDetails()

    }, [isFocus])
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
        }else{
          setAccount(null)
        }
      }).catch((err) => {
        console.log("err", err)
      }).finally(() => {
        setLoading(false)
      })
  }
  const _bankaccountDetails = () => {
    setLoading(true)
    var formdata = new FormData();
    formdata.append("user_id", userDetails?.id);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    fetch(`${DOMAIN}get_my_bank_account`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        console.log("BankAccount=>>>>>>>", res)
        if (res.status == "1") {
          setBankAccount(res?.result)
        }else{
          setBankAccount(null)
        }
      }).catch((err) => {
        console.log("err", err)
        setBankAccount(null)
      }).finally(() => {
        setLoading(false)
      })
  }
  const _removebankaccount = () => {
    setLoading(true)
    var formdata = new FormData();
    formdata.append("user_id", userDetails?.id);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    fetch(`${DOMAIN}delete_my_bank_account`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        console.log("_removebankaccount=>>>>>>>", res)
        if (res.status == "1") {
          await _bankaccountDetails()
          successToast(res?.message)
        }
      }).catch((err) => {
        console.log("err", err)
      }).finally(() => {
        setLoading(false)
      })
  }
  const _removemycard = () => {
    setLoading(true)
    var formdata = new FormData();
    formdata.append("user_id", userDetails?.id);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    fetch(`${DOMAIN}delete_my_card_account`, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        console.log("_removemycard=>>>>>>>", res)
        if (res.status == "1") {
          successToast(res?.message)
          await _accountDetails()
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
      <HeaderTwo title={localizationStrings.bank_details} navigation={navigation} />
      <View style={{ flex: 1, padding: 20 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>


          <Text style={{ fontSize: 18, fontWeight: '600', color: "#000" }}>My Card</Text>
          {account?.card_holder_name && <TouchableOpacity

            onPress={() => { _removemycard() }}
            style={{}}>
            <Text style={{ color: 'red', fontWeight: '700' }}>Remove Card</Text>
          </TouchableOpacity>}
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('BankDetails')
          }}
          style={{ position: 'absolute', bottom: 50, right: 30 }}>
          <Image source={require('../../assets/dinkyimg/AddCard3x.png')} style={{ height: 50, width: 50, }} />
        </Pressable>

        <View style={{ marginTop: 10 }} />
        {loading ?
          <View style={{ marginTop: 30, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size={"small"} />
          </View>
          :
          account == null ?
            <View style={{ borderWidth: 1, height: hp(20), borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: '#000', fontWeight: '700' }}>{localizationStrings.purchase}</Text>
            </View>
            : <>
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
            </>
        }
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


          <Text style={{ fontSize: 18, fontWeight: '600', color: "#000", marginTop: 30 }}>My Account</Text>
          {BankAccount?.holder_name && <TouchableOpacity
            onPress={() => { _removebankaccount() }}
            style={{ marginTop: 30 }}>
            <Text style={{ color: 'red', fontWeight: '700' }}>Account Delete</Text>
          </TouchableOpacity>}
        </View>
        {loading ?
          <View style={{ marginTop: 30, alignItems: "center", justifyContent: "center" }}>

          </View>
          : BankAccount == null ? <View style={{ borderWidth: 1, marginTop: 30, height: hp(20), borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: '#000', fontWeight: '700' }}>No Account</Text>
          </View> : <>

            <View style={[styles.cardContainer, { marginTop: 30, backgroundColor: '#fff' }]}>
              {/* Card Logo */}


              {/* Chip */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/bank.png')}
                  style={[styles.chip, { marginTop: 0, }]}
                />
                <Text style={[styles.cardHolder, { color: '#000', marginLeft: 20, marginTop: 0 }]}>{BankAccount?.holder_name}</Text>
              </View>
              {/* Card Number */}
              <Text style={[styles.cardNumber, { color: '#000', fontSize: 14, fontWeight: '600' }]}>Account No. {BankAccount?.acc_number}</Text>

              <Text style={[styles.cardNumber, { color: '#000', fontSize: 14, fontWeight: '600' }]}>SWIFT/BIC Code. {BankAccount?.code}</Text>

              <Text style={[styles.cardNumber, { color: '#000', fontSize: 14, fontWeight: '600' }]}>Bank Code. {BankAccount?.bank_code}</Text>

              {/* Cardholder Name */}


              {/* Expiry Date */}
              <View style={styles.cardDetails}>
                <Text style={[styles.label, { color: '#000', fontSize: 16 }]}></Text>
                <Text style={[styles.expiryDate, { color: 'green', fontSize: 14, fontWeight: '800' }]}>Active</Text>
              </View>
            </View>
          </>
        }

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
    marginTop: 5,
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
