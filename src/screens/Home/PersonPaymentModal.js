

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { errorToast, successToast } from '../../utils/customToast';
import { useNavigation } from '@react-navigation/native';
import { DOMAIN } from '../../services/Config';
import localizationStrings from '../Localization/Localization';

const PersonPaymentModal = ({ modalVisible, setModalVisible, price = 199, currency = '€', data, withdraw = false }) => {

    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const userDetails = useSelector((state) => state?.user?.user)
    const [error, setError] = useState('')
    const navigation = useNavigation()

 

    
    
    
    const continue_fun = async () => {


        setLoading(true)
        const token = userDetails?.access_token
        const pay = Number(amount)+0.35
        if (withdraw) {

            if (pay < 100) {

                setError('Minmum Withdraw Amount €100 ')
                setLoading(false)
                return errorToast('Minmum Withdraw Amount €100 ')
            }
            if (pay > Number(price)) {
                setError('Insufficient Funds ')
                setLoading(false)
                return errorToast('Insufficient Funds ')
            }

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const formdata = new FormData();
            formdata.append("amount", pay);
            formdata.append("user_id", userDetails?.id);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            await fetch("https://panel.dkyss.es/api//withdraw_amount", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const res = JSON.parse(result)

                    if (res?.status) {
                        successToast(res?.message)
                        setLoading(false)

                    }
                    else {
                        successToast(res?.message)
                        setLoading(false)
                    }


                })
                .catch((error) => {


                    console.error(error)

                    setLoading(false)
                }
                );


            setModalVisible(false)
        }
        else {
            console.log('called',Number(amount) >= 10);
if(Number(amount) < 10)  {
    setError('Minmum  Amount €10 ')

  setLoading(false)
    return   errorToast('Please Enter Minmum  Amount €10 ')

}

const pay = Number(amount)+0.35
          
            var formdata = new FormData();
            formdata.append("email", userDetails?.email);
            formdata.append("price",pay);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            await fetch(`${DOMAIN}create-checkout-session`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res?.data?.url) {
                        setLoading(false)
                        navigation.navigate("WebViewScreen", {amount, details: data?.details, url: res?.data?.url, shipping_charge:0, wallet: false, payINper: true })
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })






            setModalVisible(false)
            setLoading(false)
        }
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Price Display */}
                    <View style={styles.priceContainer}>
                        <View style={{ width: '75%', alignItems: 'center', justifyContent: 'center', }}>
                            <TextInput
                                value={amount}
                                onChangeText={(txt) => setAmount(txt)}
                                placeholder={localizationStrings.enter_amount}

                                style={{
                                    fontSize: 20, color: '#000', fontWeight: '600', width: '100%',
                                    borderBottomWidth: 1, textAlign: 'center'
                                }}
                                placeholderTextColor={'#000'} />
                        </View>
                        {amount != '' && <Text style={styles.currencyText}>{currency}</Text>}
                    </View>
                    <Text style={[styles.infoText]}>{localizationStrings.delivery_person}</Text>
                    <Text style={[styles.infoText,{marginTop:-5}]}>{localizationStrings.max_payment}</Text>
                    <Text style={[{ color: 'red', fontWeight: '400', fontSize: 14 }]}>{error}</Text>

                    {/* Continue Button */}
                    <TouchableOpacity style={styles.button} onPress={() => { continue_fun() }}>
                        {loading ? <ActivityIndicator size={25} color={'#fff'} /> : <Text style={styles.buttonText}>{localizationStrings.continue}</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={() => { setModalVisible(false) }}>
                        <Text style={styles.buttonText1}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    button1: {
        position: 'absolute',
        right: 15,
        top: 10,

    },
    buttonText1: {
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        paddingVertical: 60,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    priceText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#000',
    },
    decimalText: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginLeft: 5,
        color: '#000',
    },
    currencyText: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginLeft: 5,
        color: '#000',
    },
    infoText: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 20,
        marginTop: 20
    },
    button: {
        backgroundColor: '#2BC4A4',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginTop: 40
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PersonPaymentModal;
