import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View ,Text, BackHandler, Image} from 'react-native';
import WebView from 'react-native-webview';
import MyStatusBar from '../../elements/MyStatusBar';
import HeaderTwo from '../../components/Header';
import { useSelector } from 'react-redux';
import { DOMAIN } from '../../services/Config';
import { successToast } from '../../utils/customToast';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BackNav from "../../assets/svg/BackNav.svg"
import ExitConfirmationModal from './ExitConfirmationModal';
import localizationStrings from '../Localization/Localization';
const WebViewScreen = ({ route,  }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const { url,ProductId, details, shipping_charge, wallet, amount,payINper,Hightlight ,selectedOption ,subscription,plan_id} = route?.params
    const [modalVisible, setModalVisible] = useState(false);
    const [webView, setwebView] = useState(true);
const navigation = useNavigation()
    const onNavigationStateChange = navState => {
        const filename = navState?.url?.split('/')?.pop()?.split('?')[0].split('#')[0];
        if (filename == "handle-checkout-success") {

            setwebView(false)
            if (wallet) {
                setwebView(false)
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
            }
            
         else  if(payINper){
            setwebView(false)
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            fetch(navState?.url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  
                    if (result?.session?.payment_status == "paid") {
                        navigation.navigate('CreateMettingScreen', { details, shipping_charge,amount,payment_intent:result?.session?.payment_intent })
             
                    }
                })
                .catch((error) => console.error(error));


            }
         else  if(Hightlight){
  

            console.log('Hightlight=>>>>');
            
                const formdata = new FormData();
                formdata.append("product_id", ProductId); // Replace ProductId with the actual value
                formdata.append("days_highlight", selectedOption?.duration); // Replace selectedOption with the actual object
              
                // Define the request options
                const requestOptions = {
                  method: "POST",
                  body: formdata,
                  redirect: "follow"
                };
              
                // Make the API request
                fetch("https://panel.dkyss.es/api/highlight_product", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log('higlight=>>>>>',result);
                  
                    if (result?.status == "1") {
                    navigation.navigate('Bottomtab')
             
                    }
                })
                .catch((error) => console.error(error));
          



            }
         else  if(subscription){
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            fetch(navState?.url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
        
                const formdata = new FormData();
                formdata.append("user_id", userDetails?.id); // Replace ProductId with the actual value
                formdata.append("plan_id", plan_id); // Replace selectedOption with the actual object
              
                formdata.append("total_amount", '1.5'); // Replace selectedOption with the actual object
              
                formdata.append("payment_intent", result?.session?.payment_intent ); // Replace selectedOption with the actual object
              
                // Define the request options
                const requestOptions = {
                  method: "POST",
                  body: formdata,
                  redirect: "follow"
                };
              
                // Make the API request
                fetch("https://panel.dkyss.es/api/create_subscription", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log('higlight=>>>>>',result);
                  
                    if (result?.status == "1") {

                        successToast(result?.message)
                    navigation.navigate('Subscription')
             
                    }
                })
                .catch((error) => console.error(error));
          
            })
            .catch((error) => console.error(error));
           



            }
            else {
                const requestOptions = {
                    method: "GET",
                    redirect: "follow"
                };
                fetch(navState?.url, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                      
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

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            // Show the modal when the back button is pressed
            setModalVisible(true);
            return true; // Prevent default back button behavior
          };
      
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
          return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
      );

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <View style={styles.container}>
            <Pressable style={{ position: "absolute", left: 25 }} onPress={() => {setModalVisible(true)}}>
           <BackNav width={32} height={32} />
            </Pressable>
            <Text  style={{ color: "#000",fontWeight:'700',fontSize:20 }} >{localizationStrings.payment}</Text>
        </View>
    { webView &&       <WebView
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
}


{!webView &&
   <View style={{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
    <Image   source={require('../../assets/paymentdone.png')}  style={{height:'80%',width:'80%'}}
    resizeMode='contain'/>
   </View>  
}
<ExitConfirmationModal 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
      />
        </View>

    );
}
export default WebViewScreen;

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        justifyContent: "center",
        padding: 20,
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"

    },
})