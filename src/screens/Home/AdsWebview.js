
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


const AdsWebview = ({ route,  }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const { url, details, shipping_charge, wallet, amount,payINper,driver,formdata } = route?.params
    const [modalVisible, setModalVisible] = useState(false);
    const [webView, setwebView] = useState(true);
const navigation = useNavigation()
    const onNavigationStateChange = navState => {
        const filename = navState?.url?.split('/')?.pop()?.split('?')[0].split('#')[0];
        if (filename == "handle-checkout-success") {

           if(!driver) {const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            fetch(navState?.url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              
                if (result?.session?.payment_status == "paid") {
                    var formdata = new FormData();
                    formdata.append("user_id", userDetails?.id);
                    formdata.append("ads_id", details.id);
                    formdata.append("total_amount", details.price);
                    formdata.append("payment_intent", result?.session?.payment_intent);

                    const requestOptions = {
                        method: "POST",
                        body: formdata,
                        redirect: "follow"
                    };
                    fetch(`${DOMAIN}buy_ads`, requestOptions)
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
            else{
                    console.log('save-driver-details');
                    
                    const requestOptions = {
                        method: "POST",
                        body: formdata,
                        redirect: "follow"
                    };
                    fetch(`${DOMAIN}save-driver-details`, requestOptions)
                        .then((response) => response.json())
                        .then(async (res) => {
                            if (res.status == "1") {
                                console.log('res.status',res.status);
                                successToast("Driver Details registered successfully!",3000)
                                navigation.navigate('TabNavigator')
                               
                            } else {
                                errorToast(res?.message, 3000)
                            }
                        }).catch((err) => {
                            console.log("err", err)
                        }).finally(() => {
                            setLoading(false)
                        })
                    
                    
                      
            }
             
        }
    }



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
            <Text  style={{ color: "#000",fontWeight:'700',fontSize:20 }} >Payment</Text>
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
export default AdsWebview;

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