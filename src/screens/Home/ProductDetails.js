
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator, Dimensions, Linking } from 'react-native'
import MyText from '../../elements/MyText'
import { useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import BackNav from "../../assets/svg/BackNav.svg"
import PinSvg from "../../assets/svg/pin.svg"
import ShareSvg from "../../assets/svg/share.svg"
import HeartSvg from "../../assets/svg/heart.svg"
import HeartColorSvg from "../../assets/svg/heartColor.svg"
import ChatIcon from "../../assets/svg/chaticon.svg"
import ShieldSvg from "../../assets/svg/shiled.svg"
import Globe from "../../assets/svg/Gloab.svg"
import Iicon from "../../assets/svg/ICon.svg"
import BlackPin from "../../assets/svg/BlackPin.svg"
import MyButton from '../../elements/MyButton'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import { AirbnbRating } from 'react-native-ratings';
import Theme from '../../theme'
import { errorToast } from '../../utils/customToast'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Ratting from '../Delivery/Ratting'
import ProductReview from './Productreview'
import AddReview from './AddReview'
import AddReviewModal from './AddReview'
import Share from 'react-native-share';
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3193951768942482/3501985130';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
  });
const { width } = Dimensions.get('window');

const ProductDetails = ({ navigation, route }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const { item } = route?.params
    const [loaded, setLoaded] = useState(false);

    const isFocus = useIsFocused()
    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          setLoaded(true);
        });
    
        // const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
        //   if (Platform.OS === 'ios') {
        //     // Prevent the close button from being unreachable by hiding the status bar on iOS
        //     StatusBar.setHidden(true)
        //   }
        // });
    
        // const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        //   if (Platform.OS === 'ios') {
        //     StatusBar.setHidden(false)
        //   }
        // });
    
        // Start loading the interstitial straight away
        interstitial.load();
    
        // Unsubscribe from events on unmount
        return () => {
          unsubscribeLoaded();
         
        };
      }, [isFocus]);
    
      // No advert ready to show yet
      if (!loaded) {
       console.log('addd not loaded');
       
      }
    

    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState("3")
    const [message, setMessage] = useState()
    const [ratingData, setRatingData] = useState([])
    const [ReviewModal, setReviewModal] = useState(false)
const [reviewCount,setreviewCount] = useState(3)

    useFocusEffect(
        React.useCallback(() => {
            _getProductdetails()
            get_rating()
        }, [])
    )

    const ratingCompleted = () => {
        _getProductdetails()
        get_rating()
    }

    const get_rating = () => {
        setLoading(true)
        var formdata = new FormData();
        // formdata.append("product_id", !item?.product_data?.id ? item?.id : item?.product_data?.id);
        formdata.append("product_id", item?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-reviews`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res?.status == "1") {
                    setRatingData(res?.result)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _rating = () => {
        if (!message) {
            errorToast("Enter Something...")
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("user_id", userDetails?.id);
            formdata.append("product_id", item?.id);
            formdata.append("rating", rating);
            formdata.append("message", message);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}add-review`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.status == "1") {
                        get_rating()
                        setMessage("")
                    }
                }).catch((err) => {
                    console.log("err", err)
                })
        }
    }
    const openGoogleMaps = (latitude, longitude) => {

        if(latitude == '' || longitude == '') return errorToast('No Product Address Found',3000)
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url).catch((err) => console.error('Error opening Google Maps:', err));
      };
    
    const _getProductdetails = () => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetails?.access_token}`);
        var formdata = new FormData();
        formdata.append("product_id", item?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-product-details`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setDetails(res?.product_data)
                }
            }).catch((err) => {
                console.log("err", err)
            })
    }

    const add_fav = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetails?.id);
        formdata.append("product_id", item?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}add-favourite-product`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _getProductdetails()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const remove_fav = () => {
     
        setLoading(true)
        var formdata = new FormData();
        formdata.append("fav_id", !item?.product_data?.id ? item?.id : item?.product_data?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}delete-favourite`, requestOptions)
      
            .then(async (res) => {

                if (res.status == "200") {
                 
                    _getProductdetails()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const [activeIndex, setActiveIndex] = useState(0); // State to track the active index

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const handleShare = async () => {
        const shareOptions = {
          title: 'Share Title',
          message: 'Check out this awesome content!',
          url: 'https://example.com', // URL to share
          // You can add more options like social: Share.Social.WHATSAPP
        };
    
        try {
          await Share.open(shareOptions);
        } catch (error) {
          console.log('Error sharing:', error);
        }
      };
    //ads 

    

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
                <View style={{ height: 350 }}>


                    <FlatList
                        data={item?.product_images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: width, // Full width of the screen for each image
                                    height: hp(50),
                                    marginLeft: 10,
                         
                                }}
                                resizeMode='contain'
                            />
                        )}
                        onViewableItemsChanged={onViewRef.current}
                        viewabilityConfig={viewConfigRef.current}
                    />
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        {item?.product_images?.map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    height: 8,
                                    width: 8,
                                    borderRadius: 4,
                                    backgroundColor: index === activeIndex ? 'green' : 'gray',
                                    margin: 5,
                                }}
                            />
                        ))}
                    </View>

                    <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
                    <View style={{
                        width: "90%", alignSelf: "center", flexDirection: "row",
                        alignItems: "center", justifyContent: "space-between", position: "absolute", top: 60
                    }}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <BackNav width={32} height={32} />
                        </Pressable>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                           <Pressable
                           onPress={()=>{
                            handleShare()
                           }}
                           >

                            <ShareSvg width={28} height={28} />
                           </Pressable>

                            <Pressable onPress={() => details?.favourite == false && add_fav()}>
                                {loading ? <ActivityIndicator size={"small"} />
                                    :
                                    !details?.favourite ?
                                        <HeartSvg width={24} height={24} />
                                        :
                                        <HeartColorSvg width={24} height={24} />
                                }
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 20, flex: 1 }}>
                    <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 20 }}>
                        € {item?.price}
                    </Text >
                    <Text style={{ color: "#1C1B1B", marginTop: 5, fontWeight: '700', fontSize: 17 }}>
                        {item?.title?.substring(0, 30)}
                    </Text >
                    <Text h6 semibold style={{ color: "#949494", fontWeight: '500', fontSize: 12,width:'80%' }}>
                        {item?.product_location?.substring(0, 100)}
                    </Text >
                    <TouchableOpacity 
                    onPress={()=>{
          if(loaded){

                                        interstitial.show()
                                    }
                        navigation.navigate('UserProfile',{item:details?.user_data})
                    }}
                    style={{ width: "100%", borderRadius: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 18, gap: 10 }}>
                        <View style={{ width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: "#04CFA433", overflow: "hidden" }} >
                            <Image source={{ uri: details?.user_data?.image }} style={{ width: "100%", height: "100%" }} />
                        </View>
                        <View style={{ width: "65%" }}>
                            <Text style={{ color: "#1C1B1B", fontSize: 14, fontWeight: '600' }}>
                                {details?.user_data?.user_name}  {details?.user_data.label === 'professional'&&<Image source={require('../../assets/verified.png')}  style={{height:20,width:20,marginLeft:20}} />}
                            </Text >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5, marginTop: 5 }}>
                                <Ratting Ratting={details?.ratting} />
                                <Text style={{ color: "#000", fontSize: 12, fontWeight: '600', marginLeft: 10 }}>
                                {details?.ratting}
                                </Text >
                            </View>
                        </View>
                        <Pressable onPress={() => details == null ? null : navigation.navigate("ChattingScreen", {
                            item: {
                                image: details?.user_data?.image,
                                name: details?.user_data?.user_name,
                                product_id: details?.id,
                                reciever_id: details?.user_id
                            },
                            product:item
                        })}>
                            <ChatIcon width={65} height={44} />
                        </Pressable>
                    </TouchableOpacity>
                    <Text style={{ color: "#64646b",fontSize:14,fontWeight:'500' }}>
                        {details?.description}
                    </Text >
                    {/* <View style={{ width: "100%", borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 15, marginVertical: 18, padding: 15, backgroundColor: "#04CFA433" }}>
                        <Globe />
                        <View style={{ width: "80%" }}>
                            <Text style={{ color: "#04CFA4", fontWeight: '600', fontSize: 13 }}>
                                You can save money and help the planet when you buy second-hand products
                            </Text >
                            <Text style={{ color: "#04CFA4", marginTop: 15, fontWeight: '500', fontSize: 16 }}>
                                More information
                            </Text >
                        </View>
                    </View> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:30 }}>

                        <Text style={{ color: "#000", fontWeight: '600', fontSize: 18, marginRight: 5 }}>
                            Delivery in {details?.estimate_delivery_days} days
                        </Text >
                        <Iicon height={25} />
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                        <PinSvg width={44} height={44} />
                        <View style={{ width: "80%" }}>
                            <Text style={{ color: "#000", fontWeight: '600', fontSize: 16, marginRight: 5 }}>
                                At collection point from €{details?.at_collection_point}
                            </Text >
                           
                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                        <PinSvg width={44} height={44} />
                        <View style={{ width: "80%" }}>
                            <Text style={{ color: "#000", fontWeight: '600', fontSize: 16, marginRight: 5 }}>
                                At my address from €{details?.at_my_address}
                            </Text >
                          
                        </View>
                    </View>
                    <View style={{ width: "100%", borderRadius: 12, marginVertical: 18, padding: 15, borderWidth: 1, borderColor: "#EDEDED" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                                <ShieldSvg width={28} height={28} />
                                <Text style={{ color: "#000", fontWeight: '700', fontSize: 15, marginRight: 5 }}>
                                    Dpop Protection
                                </Text >
                            </View>
                            <View >
                                <Text style={{ color: "#04CFA4", fontWeight: '600', fontSize: 15, marginRight: 5 }}>
                                    + Info
                                </Text >
                            </View>
                        </View>
                        <MyText h6 regular style={{ color: "#C3C6C9", marginTop: 15 }}>
                            Buy without worries through our shipping service. Transaction protected with refunds, secure payments and help whenever you need it.
                        </MyText >
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                        <BlackPin width={20} height={20} />
                        <Text style={{ color: "#000", fontWeight: '600', fontSize: 14, marginRight: 5 }}>
                            {details?.zip_code}
                        </Text >
                    </View>
                    <Pressable 
                    onPress={()=>{
                        openGoogleMaps(details?.lat,details?.long)
                    }}
                    style={{
                        height: 120, borderRadius: 12, marginVertical: 18
                    }}>

                        <Image source={require('../../assets/dinkyimg/map3.png')} style={{ height: 120, borderRadius: 15, width: '100%' }} />
                        <Image source={require('../../assets/dinkyimg/location.png')} style={{
                                                        width:30, height:30, borderRadius: 12,
                                                        position:'absolute',
                                                        alignSelf:'center',
                                                        marginTop:'12%'
                                                        
                                                    }} resizeMode='cover' />
                    </Pressable>


                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 5,
                        }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginLeft: 10,



                                }}>

                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: '#101010',
                                        lineHeight: 20,
                                        marginRight: 10
                                    }}>
                                    Review
                                </Text>
                                <Ratting Ratting={details?.ratting} />


                            </View>

                        </View>
                        <Pressable onPress={() => {setreviewCount(reviewCount == 100?3:100)}} style={{}}>
                            <Text style={{ color: "#04CFA4", fontWeight: '600', fontSize: 15, marginRight: 5 }}>
                                {reviewCount == 3?'See All':'See less'}
                            </Text >
                        </Pressable>
                    </View>

                    <View
                        style={{ marginTop: 10, paddingVertical: 10, padding: 5 }}>
                        <ProductReview data={details?.reviews} count={reviewCount} />
                    </View>


                    {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                        
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                      
                            <MyText h4 bold style={{ color: "#000000" }}>
                                Review
                            </MyText >
                            <MyText h5 bold style={{ color: "#000000" }}>
                                5.0
                            </MyText >
                        </View>
                        <Pressable onPress={() => navigation.goBack()}>
                            <MyText h5 semibold style={{ color: "#04CFA4" }}>
                                See all
                            </MyText >
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <AirbnbRating
                            count={5}
                            defaultRating={3}
                            size={20}
                            showRating={false}
                            onFinishRating={ratingCompleted}
                        />
                        <TextInput multiline value={message} style={{ color: "#000", borderRadius: 12, padding: 15, paddingVertical: 20, paddingTop: 15, width: "100%", marginVertical: 20, backgroundColor: "#EBEEED", fontSize: 16 }} placeholder={"Add Comment"} placeholderTextColor={"#000"} onChangeText={(e) => setMessage(e)} />
                        <MyButton loading={loading} onPress={_rating} textStyle={{ fontSize: 16, fontFamily: Theme.FONT_FAMILY_SEMIBOLD }} style={{ borderRadius: 15, width: "100%", alignSelf: "center", marginBottom: 20 }} title={"Submit"} />
                        {ratingData?.length == 0 ? null
                            :
                            ratingData?.map((item, index) => {
                                return (
                                    <View key={index} style={{ width: "100%", borderRadius: 12, marginBottom: 18, padding: 15, borderWidth: 1, borderColor: "#EDEDED" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                                                <View style={{ width: 36, height: 36, borderRadius: 36 / 2, backgroundColor: "#04CFA433", overflow: "hidden" }} >
                                                    <Image source={{ uri: item?.user_data?.[0]?.image }} style={{ width: "100%", height: "100%" }} />
                                                </View>
                                                <MyText h5 bold style={{ color: "#000000" }}>
                                                    {item?.user_data?.[0].user_name}
                                                </MyText >
                                            </View>
                                            <View style={{ borderRadius: 8, padding: 2, paddingHorizontal: 20, borderWidth: 1, borderColor: "#FFD33C" }} >
                                                <MyText h5 bold style={{ color: "#FFD33C" }}>
                                                    {item?.rating} *
                                                </MyText >
                                            </View>
                                        </View>
                                        <MyText h6 regular style={{ color: "#677294", marginTop: 15 }}>
                                            {item?.message}
                                        </MyText >
                                    </View>
                                )
                            })}
                    </View> */}
                    <AddReviewModal visible={ReviewModal}  onClose={()=>{
                        setReviewModal(false)
                        ratingCompleted()}}  item={item}/>
                    <TouchableOpacity
                    onPress={()=>{
                        setReviewModal(true)
                        interstitial.show()
                    }}
                    >

                    <Text style={{ color: "#04CFA4", alignSelf: "center", fontWeight: '600', fontSize: 16 }}>
                        Review product
                    </Text >
                    </TouchableOpacity>
                  <MyButton onPress={() => details == null ? null : navigation.navigate("Delivery", { details })}
                        textStyle={{ fontWeight: '700' }}
                        title={"Buy"} style={{ borderRadius: 12, marginTop: 10, }} />

                </View>
            </ScrollView>

        </View>
    )
}

export default ProductDetails