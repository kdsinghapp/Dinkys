/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Pressable, Image, View, TouchableOpacity, TextInput, ScrollView, ImageBackground, FlatList, Text
} from 'react-native'

import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import RechargeSvg from "../../assets/svg/Recharge.svg"
import PaySvg from "../../assets/svg/Charge.svg"
import WithDraw from "../../assets/svg/Withdraw.svg"
import ProRight from "../../assets/svg/proright.svg"
import BankSvg from "../../assets/svg/bank.svg"
import HistorySvg from "../../assets/svg/history.svg"
import { useSelector } from 'react-redux'
import AddMoneyModal from './WalletAmount'
import { DOMAIN } from '../../services/Config'
import PersonPaymentModal from '../Home/PersonPaymentModal'

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import localizationStrings from '../Localization/Localization'



const Wallet = ({ route }) => {
    const { user } = route?.params
    const [AmoutModalVisible,setAmoutModalVisible] = useState(false)
    const userDetails = useSelector((state) => state?.user?.user)
   
    const navigation = useNavigation()
    const [amount, setAmount] = useState()
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [User, setUser] = useState(0)
  
    const add_wallet = () => {
      if (!amount) {
        errorToast("Please Enter Amount", 3000)
      } else {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("email", userDetails?.email);
        formdata.append("price", amount);
        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };
        fetch(`${DOMAIN}create-checkout-session`, requestOptions)
          .then((response) => response.json())
          .then(async (res) => {
        
            if (res?.data?.url) {
              navigation.navigate("WebViewScreen", { details: undefined, url: res?.data?.url, shipping_charge: undefined, wallet: true, amount })
              setModalVisible(false)
            }
          }).catch((err) => {
            console.log("err", err)
          }).finally(() => {
            setLoading(false)
          })
      }
    }
  
    useEffect(()=>{
      get_user()
    },[AmoutModalVisible])
    


  const get_user =()=>{
    const token = userDetails?.access_token

    const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://panel.dkyss.es/api/get-profile", requestOptions)
  .then((response) => response.text())
  .then((result) => {

    const res = JSON.parse(result)

    setUser(res.data)

  })
  .catch((error) => console.error(error));
  }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={localizationStrings.wallet} navigation={navigation} />
            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ padding: 20, width: "100%", borderRadius: 15, elevation: 5, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
                <Text  style={{color:'#04CFA4',fontWeight:'600',fontSize:16,marginTop:10}}>{localizationStrings.principal_e}</Text>
                <Text  style={{color:'#04CFA4',fontWeight:'700',fontSize:22,marginTop:10}}>€ {User?.wallet}</Text>
                    <View style={{ width: "100%",
                    alignItems:'center',justifyContent:'center',
                    borderRadius: 15, marginTop: 15, flexDirection: "row", backgroundColor: "#fff", alignItems: "center" }}>
                        <Pressable onPress={() => {setModalVisible(true)}} style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                            <RechargeSvg width={41} height={41} />
                            <Text  style={{color:'#04CFA4',fontWeight:'500',fontSize:14,marginTop:10}}>{localizationStrings.recharge}</Text>
                        </Pressable>
                        {/* <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>
                            <PaySvg width={41} height={41} />
                            <Text  style={{color:'#04CFA4',fontWeight:'500',fontSize:14,marginTop:10}}>Pay</Text>
                        </View> */}
                        <View style={{ width: "33%", justifyContent: "center", alignItems: "center" }}>

                          <Pressable 
                          onPress={()=>{
                            setAmoutModalVisible(true)
                          }}
                          >

                            <WithDraw width={41} height={41} />
                          </Pressable>
                  
                                
                            <Text  style={{color:'#04CFA4',fontWeight:'500',fontSize:14,marginTop:10}}>{localizationStrings.withdraw}</Text>
                        </View>
                    </View>
                </View>
                <Pressable onPress={() => navigation.navigate("BallanceHistory")} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 20, justifyContent: "space-between", marginTop: 20 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 40 / 2, backgroundColor: "#04CFA410", justifyContent: "center", alignItems: "center" }}>
                        <HistorySvg width={24} height={24} />
                    </View>
                    <View style={{ width: "75%" }}>
                    <Text  style={{color:'#000',fontWeight:'500',fontSize:16}}>{localizationStrings.balance_history}</Text>
                    </View>
                    <ProRight width={16} height={16} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("BankScreen")} style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 20, justifyContent: "space-between", marginTop: 10 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 40 / 2, backgroundColor: "#04CFA410", justifyContent: "center", alignItems: "center" }}>
                        <BankSvg width={24} height={24} />
                    </View>
                    <View style={{ width: "75%" }}>
                    <Text  style={{color:'#000',fontWeight:'600',fontSize:16}}>{localizationStrings.bank_details}</Text>
                    </View>
                    <ProRight width={16} height={16} />
                </Pressable>

            </View >

            <PersonPaymentModal modalVisible={AmoutModalVisible} setModalVisible={setAmoutModalVisible}
            price={User?.wallet}
            
           withdraw={true} />
      
            <AddMoneyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        amount={amount}
        setAmount={setAmount}
        loading={loading}
        add_wallet={add_wallet}
      />
        </View>

    )
}

export default Wallet
