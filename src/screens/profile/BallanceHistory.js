/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Pressable, Image, View, Text,TouchableOpacity, TextInput, ScrollView, ImageBackground, FlatList, ActivityIndicator, StyleSheet
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { DOMAIN } from '../../services/Config'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
const BallanceHistory = ({ route }) => {
    const navigation = useNavigation()
    const userDetails = useSelector((state) => state?.user?.user)
    const [balance, setBalance] = useState([])
    const [loading, setLoading] = useState(false)


    useFocusEffect(
        React.useCallback(() => {
            _get_balance()
        }, [])
    )
    const _get_balance = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-my-balance-history`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    setBalance(res.result)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      };
    const renderItem = ({ item }) => (
        <View style={{ height: hp(12), paddingHorizontal: 5, justifyContent: 'center' }}>
          <View style={{ height: 40, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ justifyContent: 'space-between', marginLeft: 5 }}>
              <Text style={styles.amountText}>€ {item.amount}</Text>
              <Text style={[styles.paymentTypeText, { color: item.payment_type === 'Debit' ? '#F44336' : '#4CAF50' }]}>
                {item.payment_type}
              </Text>
            </View>
            <View>
              <Image
                source={item.payment_type === 'Debit' ? require('../../assets/dinkyimg/Iconred3x.png') : require('../../assets/dinkyimg/Icongreenreceived3x.png')}
                style={styles.paymentIcon}
              />
              <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
        </View>
      );
    

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo title={"Ballance History"} navigation={navigation} />
            <ScrollView contentContainerStyle={{ flex: 1, padding: 20 }}>
                {loading ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                    :
                    balance?.length == 0 ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <MyText>No data here...</MyText>
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          data={balance}
                          renderItem={renderItem}
                          keyExtractor={(item) => item.payment_id.toString()}
                        />
                      </View>
                }

            </ScrollView >
        </View>

    )
}

export default BallanceHistory


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      paddingHorizontal: 15,
    },
    header: {
      marginTop: 30,
    },
    headerText: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '700',
      color: '#000000',
    },
    balanceContainer: {
      backgroundColor: '#0BD89E',
      height: hp(20),
      borderRadius: 20,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    balanceLabelText: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: '#FFFFFF',
    },
    balanceText: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    withdrawButton: {
      height: 45,
      backgroundColor: '#352C48',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
      borderRadius: 30,
      marginTop: 20,
    },
    withdrawButtonText: {
      fontWeight: '600',
      fontSize: 14,
      color: '#FFFFFF',
      lineHeight: 25.5,
      marginLeft: 10,
    },
    historyHeader: {
      height: hp(5),
      marginTop: 10,
      justifyContent: 'center',
    },
    historyHeaderText: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '700',
      color: '#000',
    },
    amountText: {
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 18,
      alignItems: 'center',
      color: '#000000',
    },
    paymentTypeText: {
      fontWeight: '400',
      fontSize: 12,
      marginTop: 10,
      lineHeight: 14,
      alignItems: 'center',
    },
    paymentIcon: {
      height: 30,
      width: 30,
      alignSelf: 'flex-end',
    },
    dateText: {
      fontWeight: '400',
      fontSize: 12,
      lineHeight:14,
      alignItems: 'center',
      color: '#000',
      marginTop: 10,
    },
  });