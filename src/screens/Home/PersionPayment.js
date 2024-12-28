import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Button, Pressable } from 'react-native';
import HeaderTwo from '../../components/Header';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { DOMAIN } from '../../services/Config';
import MyButton from '../../elements/MyButton';
import { errorToast, successToast } from '../../utils/customToast';
import localizationStrings from '../Localization/Localization';

const PersionPayment = () => {
    const navigation = useNavigation()
    const route = useRoute()

    const [selectPay, setSelectPay] = useState("card")
    const Wallet = useSelector((state) => state?.user?.wallet)
    const userDetails = useSelector((state) => state.user.user)
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [paymentSuccess, setpaymentSuccess] = useState(false)
    const [showIcon, setshowIcon] = useState(false)

    const { details, shipping_charge } = route.params
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
    const payment_wallet = () => {
    //   setpaymentSuccess(true)
     
      if ((Number(details?.price)) > Wallet) {
        return errorToast("Please add more money to your wallet.");
    }
    
        else {
            try {
                const pay = Number(details?.price)+0.35
                setLoading(true)
                var formdata = new FormData();
                formdata.append("user_id", userDetails?.id);
                formdata.append("product_id", details?.id);
                formdata.append("shipping_address", details?.product_location);
                formdata.append("payment_status", "paid");
                formdata.append("total_amount", pay);
                formdata.append("shipping_charge", String(shipping_charge));
                formdata.append("lat", details?.lat);
                formdata.append("long", details?.long);
                formdata.append("payment_intent", "WALLET");
                const requestOptions = {
                    method: "POST",
                    body: formdata,
                    redirect: "follow"
                };
                fetch(`${DOMAIN}create_order`, requestOptions)
                    .then((response) => response.json())
                    .then(async (res) => {
                        if (res?.status == "1") {

                            const timer = setTimeout(() => {
                                setshowIcon(true);

                            }, 3000); // 4000 milliseconds = 4 seconds

                            // Clean up the timeout if the component unmounts


                            const metting = setTimeout(() => {
                                setshowIcon(true);

                                navigation.navigate('CreateMettingScreen', { details, shipping_charge, amount: Number(details?.price) })
                            }, 5000);

                            return () => {
                                clearTimeout(metting)
                                clearTimeout(timer)
                            };

                        }
                    }).catch((err) => {
                        console.log("err", err)
                    }).finally(() => {
                        setLoading(false)
                    })
            }
            catch (err) {
                console.log('err', err);
            }
        }
    }
    const payment_handler_web = () => {
        setLoading(true)

        const pay = Number(details?.price)+0.35
        var formdata = new FormData();
        formdata.append("email", userDetails?.email);
        formdata.append("price", pay);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}create-checkout-session`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.data?.url) {
                    navigation.navigate("WebViewScreen", { details, url: res?.data?.url, shipping_charge, wallet: false, payINper: true, amount: Number(details?.price) })
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }


    return (
        <View style={styles.container}>
            <HeaderTwo navigation={navigation} title={localizationStrings.payment} />

            {!paymentSuccess &&

                <>


                    <View style={styles.walletSection}>
                        <Image source={require('../../assets/wallet.png')} style={styles.walletIcon} />

                        <Text style={styles.walletText}>{localizationStrings.when_youhave_txt}</Text>
                    </View>


                    <Pressable style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                        {/* <PersonSvg width={34} height={34} /> */}
                        <View style={{ width: "80%" }}>
                            <Text style={{ color: "#000", fontSize: 18, fontWeight: '600' }}>
                                {localizationStrings.select_payment_method}
                            </Text >
                            <View style={{ marginTop: 12, gap: 25, width: "100%" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>
                                    <Pressable onPress={() => setSelectPay("card")}
                                        style={{
                                            width: 25, height: 25, borderWidth: 2,
                                            borderColor: selectPay == "card" ? "#000" : "#04CFA4", borderRadius: 25 / 2, backgroundColor: selectPay == "card" ? "#04CFA4" : "#fff"
                                        }} />
                                    <Text style={{ color: "#303030", fontSize: 16, fontWeight: '700' }}>
                                       {localizationStrings.Card}
                                    </Text >
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 15, width: "48%" }}>

                                    <Pressable onPress={() => setSelectPay("wallet")}
                                        style={{
                                            width: 25, height: 25, borderWidth: 2,
                                            borderColor: selectPay == "wallet" ? "#000" : "#04CFA4",
                                            borderRadius: 25 / 2,
                                            backgroundColor: selectPay == "wallet" ? "#04CFA4" : "#fff"
                                        }} />
                                    <Text style={{
                                        color: "#303030",

                                        fontSize: 16, fontWeight: '700'
                                    }}>
                                        {localizationStrings.wallet}  ( {`€ ${Wallet}`} )
                                    </Text >
                                </View>

                            </View>
                        </View>
                    </Pressable>








                    <View style={styles.productSummary}>
                        <Image source={{ uri: details?.product_images?.[0].image }} style={{ height: 80, width: 80, borderRadius: 15 }} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.productName}>{details?.title}</Text>
                            <Text style={styles.totalText}>{localizationStrings.total}: €{details?.price}</Text>
                            <Text style={styles.feeText}>{localizationStrings.It_includes_payment_fees}</Text>
                        </View>
                    </View>


                    <MyButton
                        onPress={() => selectPay == "card" ? payment_handler_web() : selectPay == "wallet" ? payment_wallet() : console.log('cod')}

                        // onPress={() => {
                        //     navigation.navigate('CreateMettingScreen', { details, shipping_charge, amount: Number(details?.price) })
                        // }}
                        loading={loading} title={localizationStrings.continue} style={{ borderRadius: 12 }} />
                    <View style={{ height: 40 }} />
                </>}

            {paymentSuccess && showIcon &&

                <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/paymentdone.png')} style={{ height: '90%', width: '90%' }}
                        resizeMode='contain' />
                </View>

            }
            {paymentSuccess && !showIcon &&

                <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={40} color={'#0BD89E'} />
                </View>

            }
        </View>
    );
};

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

    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backText: {
        fontSize: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    helpText: {
        fontSize: 16,
        color: '#00AAFF',
    },
    walletSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    walletIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    walletText: {
        width: '80%',
        fontSize: 14,
        color: '#333',

    },
    cardSection: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginBottom: 24,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
    addCardButton: {
        marginTop: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#0BD89E',
        borderRadius: 6,
        alignItems: 'center',
    },
    addCardText: {
        color: '#0BD89E',
        fontSize: 14,
        fontWeight: '500'
    },
    productSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        marginBottom: 24,
        marginTop: 30
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    totalText: {
        fontSize: 16,
        color: '#333',
    },
    feeText: {
        fontSize: 12,
        color: '#888',
    },
    continueButton: {
        backgroundColor: '#0BD89E',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 60
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600'
    },
});

export default PersionPayment;
