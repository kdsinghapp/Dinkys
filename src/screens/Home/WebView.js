import React, { useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import MyStatusBar from '../../elements/MyStatusBar';
import HeaderTwo from '../../components/Header';
import { useSelector } from 'react-redux';
import { DOMAIN } from '../../services/Config';
import { successToast } from '../../utils/customToast';

const WebViewScreen = ({ route, navigation }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const { url, details, shipping_charge, wallet, amount } = route?.params

    const onNavigationStateChange = navState => {
        const filename = navState?.url?.split('/')?.pop()?.split('?')[0].split('#')[0];
        if (filename == "handle-checkout-success") {
            if (wallet) {
                const requestOptions = {
                    method: "GET",
                    redirect: "follow"
                };
                fetch(navState?.url, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log("result", result?.session?.payment_intent, result?.session?.payment_status)
                        if (result?.session?.payment_status == "paid") {
                            var formdata = new FormData();
                            formdata.append("user_id", userDetails?.id);
                            formdata.append("amount", amount);
                            formdata.append("payment_method", "wallet");
                            formdata.append("payment_status", "paid");
                            formdata.append("payment_intent", result?.session?.payment_intent);
                            const requestOptions = {
                                method: "POST",
                                body: formdata,
                                redirect: "follow"
                            };
                            fetch(`${DOMAIN}wallet-amount-add`, requestOptions)
                                .then((response) => response.json())
                                .then(async (res) => {
                                    if (res?.status == "1") {
                                        successToast("Added Money", 3000)
                                        navigation.navigate("Bottomtab")
                                    }
                                }).catch((err) => {
                                    console.log("err", err)
                                })
                        }
                    })
                    .catch((error) => console.error(error));
            } else {
                const requestOptions = {
                    method: "GET",
                    redirect: "follow"
                };
                fetch(navState?.url, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log("result", result)
                        if (result?.session?.payment_status == "paid") {
                            var formdata = new FormData();
                            formdata.append("user_id", userDetails?.id);
                            formdata.append("product_id", details?.id);
                            formdata.append("shipping_address", details?.product_location);
                            formdata.append("payment_status", "paid");
                            formdata.append("total_amount", details?.price);
                            formdata.append("shipping_charge", String(shipping_charge));
                            formdata.append("lat", details?.lat);
                            formdata.append("long", details?.long);
                            formdata.append("payment_intent", result?.session?.payment_intent);
                            const requestOptions = {
                                method: "POST",
                                body: formdata,
                                redirect: "follow"
                            };
                            fetch(`${DOMAIN}create_order`, requestOptions)
                                .then((response) => response.json())
                                .then(async (res) => {
                                    if (res?.status == "1") {
                                        successToast("Payment Successfully", 3000)
                                        navigation.navigate("Bottomtab")
                                    }
                                }).catch((err) => {
                                    console.log("err", err)
                                }).finally(() => {
                                    setLoading(false)
                                })
                        }
                    })
                    .catch((error) => console.error(error));
            }
        }

    };



    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Payment"} />
            <WebView
                source={{ uri: url }}
                javaScriptEnabled
                onNavigationStateChange={onNavigationStateChange}
                style={{ flex: 1 }}
                allowsFullscreenVideo
                pullToRefreshEnabled
                geolocationEnabled={true}
                scalesPageToFit={false}
                injectedJavaScriptBeforeContentLoaded={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`}
                injectedJavaScript={`
                document.getElementsByClassName("elementor-search-form__container")[0].style="padding:10px 10px";`}
            />
        </View>

    );
}
export default WebViewScreen;

