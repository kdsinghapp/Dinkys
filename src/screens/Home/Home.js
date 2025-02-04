
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator, Text, Modal, StyleSheet, Platform, RefreshControl } from 'react-native'
import MyText from '../../elements/MyText'
import { get_doctorList } from '../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import MyStatusBar from '../../elements/MyStatusBar'
import Bag from "../../assets/svg/bag.svg"
import SearchSvg from "../../assets/svg/search.svg"
import Heart from "../../assets/svg/Heart2.svg"
import HeartSvg from "../../assets/svg/heart.svg"
import HeartColorSvg from "../../assets/svg/heartColor.svg"
import CameraSvg from "../../assets/svg/camera.svg"
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { errorToast } from '../../utils/customToast'
import { DOMAIN } from '../../services/Config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { hp } from '../../utils/Constant'
import CloseSvg from "../../assets/svg/Close.svg"
import localizationStrings from '../Localization/Localization'
import { BannerAd, BannerAdSize, InterstitialAd, TestIds, useForeground, AdEventType } from 'react-native-google-mobile-ads';
import { getCurrentLocation, locationPermission } from '../Location/helperFunction'
import { useLocation } from '../Location/LocationContext'

const adUnitId = 'ca-app-pub-3193951768942482/5357890654';
const adUnitId2 = 'ca-app-pub-3193951768942482/3501985130';
const interstitial = InterstitialAd.createForAdRequest(adUnitId2, {
    keywords: ['fashion', 'clothing'],
});
const Home = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [loading, setLoading] = useState(false)
    const [doctorData, setDoctorData] = useState([])
    const [searchVal, setSearchVal] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState([]);
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false);
    const bannerRef = useRef < BannerAd > (null);
    const [loaded, setLoaded] = useState(false);
    const isFocus = useIsFocused()
    const { locationName, setLocationName } = useLocation(); // Get locationName and setLocationName from context

    const [refreshing, setRefreshing] = useState(false);



    useEffect(() => {
        // Fetch live location and update locationName
        const fetchLiveLocation = async () => {
            const locPermissionDenied = await locationPermission();
            if (locPermissionDenied) {
                const { latitude, longitude } = await getCurrentLocation();
                _update_location(latitude, longitude)
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCPO3jjHmxtN44lSqdaB278knxRvijkSR0`;
                try {
                    const res = await fetch(url);
                    const json = await res.json();
                    const city = findCityName(json);
                    setLocationName(city);
                } catch (e) {
                    console.log("Error fetching location:", e);
                }
            }
        };

        fetchLiveLocation();
    }, []);

    function findCityName(response) {
        const results = response.results;
        for (let i = 0; i < results.length; i++) {
            const addressComponents = results[i].address_components;
            for (let j = 0; j < addressComponents.length; j++) {
                const types = addressComponents[j].types;
                if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                    return addressComponents[j].long_name; // Return the city name
                }
            }
        }
        return null; // Return null if city name not found
    }




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
    }, [isFocus, refreshing]);

    // No advert ready to show yet
    if (!loaded) {
        console.log('addd not loaded', loaded);

    }

    // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
    // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
    useForeground(() => {
        Platform.OS === 'ios' && bannerRef.current?.load();
    })
    const [searchHistory, setSearchHistroy] = useState([])


    useFocusEffect(
        React.useCallback(() => {
            _get_allCatergories()
            _get_product()
            _get_profile()

        }, [locationName, refreshing])
    )


    const _update_location = (lat, long) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
        const formData = new FormData();
        formData.append("user_id", userDetailData?.id); // Replace with the actual user_id

        formData.append("lat", lat); // Replace with the actual user_id

        formData.append("lon", long); // Replace with the actual user_id

        const requestOptions = {
            method: "POST", // Change to POST since you're sending form data
            headers: myHeaders,
            body: formData,
            redirect: "follow",
        };

        fetch(`${DOMAIN}update-profile`, requestOptions)
            .then((response) => {
                // console.log("Raw response:", response);
                return response.text(); // Use .text() instead of .json() to inspect the raw response
            })
            .then((res2) => {
                const res = JSON.parse(res2)

                console.log('update home', res.status);

                try {

                    if (res.status == "1") {
                        console.log('Updated successfully jome:', res.status);
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    };


    useEffect(() => {
        _get_searchHistory()
    }, [user, refreshing])
    const _get_profile = () => {

        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-profile`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    dispatch({ type: "WALLET", payload: res?.data?.wallet });
                    setUser(res?.data)
                }
            }).catch((err) => {
                console.log("err", err)
            })
    }




    const _get_product = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", user?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_products`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                console.log('=>>>>>>get product>>>',);


                if (res.status == "1") {



                    setProduct(res?.data)
                    setFilterData(res?.data)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _get_allCatergories = () => {
        setLoading(true)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_category`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setCategories(res?.data)
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const _get_searchHistory = async () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", user?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        await fetch(`${DOMAIN}getSearchHistory`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setSearchHistroy(res?.result)
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const searchHandler = value => {
        setShowModal(true);
        if (value) {
            const newData = product.filter(item => {
                // Ensure item.title exists and is a string
                const itemData = item?.title ? item.title.toLowerCase() : '';
                const textData = value.toLowerCase();
                return itemData.includes(textData);
            });
            setFilterData(newData);
        } else {
            setShowModal(false);
            setFilterData(product); // Assuming `product` is the original list of products
        }
        setSearchVal(value);
    };


    const _get_search_product = async () => {

        var formdata = new FormData();
        formdata.append("user_id", user?.id);
        formdata.append("search", searchVal);


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        await fetch(`${DOMAIN}searchProducts`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    await _get_searchHistory()
                    setProduct(res?.category)
                    setFilterData(res?.category)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const _update_search_product = async (id, fav) => {
        const newFav = fav === 'TRUE' ? "FALSE" : "TRUE"
        var formdata = new FormData();
        formdata.append("fav", newFav);
        formdata.append("id", id);


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        await fetch(`${DOMAIN}updateSearch`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _get_searchHistory()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _add_favourite_product = async (id) => {
        console.log(id);
        var formdata = new FormData();
        formdata.append("user_id", user?.id);
        formdata.append("product_id", id);


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        await fetch(`${DOMAIN}add-favourite-product`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _get_product()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const _remove_search_product = async (id) => {

        var formdata = new FormData();

        formdata.append("id", id);


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        await fetch(`${DOMAIN}deleteSearch`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _get_searchHistory()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const _remove_Allsearch = async (id) => {

        var formdata = new FormData();
        formdata.append("user_id", user?.id);


        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        await fetch(`${DOMAIN}deleteSearchAll`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _get_searchHistory()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }


    const handleRefresh = () => {
        setRefreshing(true);

        // Simulate a network request
        setTimeout(() => {

            setRefreshing(false); // Stop the refreshing animation
        }, 2000);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSearchVal(item.search);
                setShowModal(false)
            }}
            style={styles.historyItem}>
            <Text style={styles.historyText}>{item.search}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity
                    onPress={() => {
                        _update_search_product(item.id, item.fav)
                    }}
                >

                    {item.fav === 'TRUE' ? <HeartColorSvg /> : <Heart />}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        _remove_search_product(item.id, "FALSE ")
                    }}
                    style={{ marginLeft: 10 }}>


                    <CloseSvg />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );




    console.log('filterData', filterData[1]?.products);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <ScrollView
                scrollEnabled={!showModal}
                showsVerticalScrollIndicator={false}>
                <View style={{
                    backgroundColor: "#fff",

                    flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5
                }}>
                    <Pressable style={{ paddingVertical: 10 }}>
                        <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 25 }}>
                            {localizationStrings.welcome}
                        </Text >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('SelectLocation')
                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>

                            <Image source={require('../../assets/location.png')} style={{ height: 15, width: 15, tintColor: '#0BD89E' }} />
                            <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 12, marginHorizontal: 5 }}>
                                {locationName ? locationName.substring(0, 15) : 'Fetching..'}
                            </Text >
                            <Image source={require('../../assets/down.png')} style={{ height: 15, width: 15, tintColor: '#0BD89E', marginTop: 2 }} />
                        </TouchableOpacity>
                    </Pressable>
                    <View style={{ flexDirection: "row", justifyContent: "center", gap: 15, alignItems: "center" }}>
                        <Pressable
                            onPress={() => {

                                if (user?.driver_register && user?.driver_data?.driver_details === 'TRUE') {
                                    navigation.navigate('TabNavigator')
                                }

                                else if (!user?.driver_data?.driver_details === 'TRUE' && user?.driver_register) {
                                    navigation.navigate('VehicleDetails')
                                }
                                else if (user) {

                                    navigation.navigate('DeliveryScreen')
                                }
                                //  navigation.navigate('DeliveryScreen')
                            }}
                            style={{ paddingVertical: 10 }}>
                            <Image source={require('../../assets/dinkyimg/truck.png')} style={{ width: 30, height: 30 }} />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                navigation.navigate('Purchases')
                            }}
                            style={{ paddingVertical: 10 }}>
                            <Bag width={28} height={28} />
                        </Pressable>
                        <Pressable

                            onPress={() => {
                                navigation.navigate('EditProfile', { userDetails: user })
                            }}
                            style={{
                                width: 40, backgroundColor: '#f0f0f0',
                                alignItems: 'center', justifyContent: 'center',
                                height: 40, borderRadius: 40 / 2
                            }}>
                            {user?.image !== 'https://api.dkyss.es/public/uploads/users/' ? <Image source={{ uri: user?.image }} style={{ width: "100%", height: "100%", borderRadius: 40 / 2 }} /> : <Text style={{ color: '#000', fontWeight: '600', fontSize: 14 }}>{user?.user_name[0]?.toUpperCase()}</Text>}
                        </Pressable>
                    </View>
                </View>
                <View style={{
                    backgroundColor: "#F3F4F5", width: "100%", borderRadius: 30,
                    height: 52,
                    flexDirection: "row", alignItems: "center", paddingHorizontal: 8, justifyContent: "space-between",
                    marginVertical: 12
                }}>
                    <SearchSvg width={16} height={16} style={{ paddingLeft: 30 }} />
                    <TextInput

                        placeholderTextColor={'#000'}
                        value={searchVal} onChangeText={(e) => searchHandler(e)} placeholder={localizationStrings.search_here}

                        style={{ width: "70%", color: '#000' }} />
                    {searchVal && <TouchableOpacity
                        onPress={() => {
                            _get_search_product()
                        }}
                        style={{
                            backgroundColor: "#04CFA4", borderRadius: 30, paddingVertical: 5,
                            paddingHorizontal: 5
                        }}>
                        <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>{localizationStrings.searches}</Text>
                    </TouchableOpacity>}
                    {!searchVal && <View style={{ width: '20%' }} />}
                </View>

                {showModal && searchHistory?.length != 0 && <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{
                            flexDirection: 'row',
                            marginBottom: 10, paddingHorizontal: 10,
                            alignItems: 'center', justifyContent: 'space-between'
                        }}>

                            <Text style={styles.modalTitle}>Recent searches ({searchHistory?.length})</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    _remove_Allsearch()
                                }}
                                style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#5f59ff' }}>Clear all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={searchHistory}

                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />

                    </View>
                </View>}

                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                    <Text style={{ color: "#1C1B1B", fontWeight: '700', fontSize: 18 }}>
                        {localizationStrings.categories}
                    </Text >
                    <Pressable onPress={() => navigation.navigate("AllCategories", { categories })} style={{ paddingVertical: 10 }}>
                        <Text style={{ color: "#04CFA4", fontWeight: '600', fontSize: 13 }}>
                            {localizationStrings.recent_item}
                        </Text >
                    </Pressable>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        alignItems: 'center',
                        width: "100%",
                        backgroundColor: "#fff",
                        marginVertical: 15
                    }}>
                    {loading ? <View style={{ width: "100%", alignItems: "center" }}><ActivityIndicator size={"small"} /></View>
                        :
                        categories?.length == 0 ? null
                            :
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {categories?.slice(3)?.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("ProductList", { item })}
                                            key={index}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 70,
                                                marginLeft: 5,
                                                height: 80
                                            }}>
                                            <Image
                                                source={{ uri: item?.image }} style={{ width: 30, height: 30 }}

                                                resizeMode='contain' />
                                            <Text regular style={{ color: "#000", textAlign: "center", fontSize: 10, fontWeight: '600', height: 40, marginTop: 8 }} >{item?.category_name?.substring(0, 20)}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                                }
                            </ScrollView>
                    }
                </View>
                <Text style={{ color: "#1C1B1B", fontWeight: '700', fontSize: 18 }}>
                    {localizationStrings.recent_item}
                </Text >
                <View style={{ flex: 1 }}>


                    {filterData?.length > 0 ? (
                        <View>
                            <FlatList
                                data={filterData}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                                }
                                renderItem={({ item }) => (
                                    <View>
                                        {/* Category Name */}
                                       {item.products?.length !== 0 && <Text style={{ color: "#1C1B1B", fontWeight: '700', fontSize: 18, marginTop: 30, marginBottom: 30 }}>
                                            {item?.category_name}
                                        </Text>}

                                        {item.products?.length > 0 && (
                                            <FlatList
                                                numColumns={2}
                                                data={item.products}
                                                keyExtractor={(product, index) => index.toString()}
                                                renderItem={({ item: product, index }) => (
                                                    <Pressable
                                                        onPress={() => {
                                                            if (loaded) {
                                                                if (interstitial) {
                                                                    interstitial.show();
                                                                }
                                                            }
                                                            navigation.navigate("ProductDetails", { product });
                                                        }}
                                                        style={{
                                                            width: "46%",
                                                            borderRadius: 12,
                                                            shadowOpacity: 0.8,
                                                            shadowRadius: 2,
                                                            shadowOffset: { height: 0, width: 0 },
                                                            backgroundColor: "#fff",
                                                            elevation: 5,
                                                            margin: 5,
                                                            marginBottom: 15,
                                                        }}
                                                    >
                                                        {/* Product Image */}
                                                        <View
                                                            style={{
                                                                borderRadius: 12,
                                                                backgroundColor: "#fff",
                                                                height: 150,
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <Image
                                                                source={{ uri: product?.product_images?.[0]?.image }}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    borderTopLeftRadius: 12,
                                                                    borderTopRightRadius: 12,
                                                                }}
                                                                resizeMode="cover"
                                                            />
                                                        </View>
                                                        {/* Product Details */}
                                                        <View style={{ margin: 5, padding: 8 }}>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                                <Text style={{ color: "#04CFA4", fontSize: 14, fontWeight: "700" }}>
                                                                    € {product?.price}
                                                                </Text>
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        _add_favourite_product(product?.id);
                                                                    }}
                                                                >
                                                                    {product?.favourite ? <Heart /> : <HeartColorSvg />}
                                                                </TouchableOpacity>
                                                            </View>
                                                            <Text style={{ color: "#000", fontWeight: "600", fontSize: 12 }}>
                                                                {product?.title?.substring(0, 20)}
                                                            </Text>
                                                            <Text style={{ color: "#949494", fontWeight: "600", fontSize: 12 }}>
                                                                {product?.description?.substring(0, 25)}
                                                            </Text>
                                                        </View>
                                                    </Pressable>
                                                )}
                                            />
                                        )  }
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 16, color: "#000", fontWeight: "600", marginTop: 60 }}>
                                {localizationStrings.no_p_f}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0 }}>
                {adUnitId && <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true
                    }}
                />}
            </View>


        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        backgroundColor: "#F3F4F5",
        width: "100%",
        borderRadius: 30,
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        justifyContent: "space-between",
        marginVertical: 12,
    },
    searchIcon: {
        paddingLeft: 30,
    },
    input: {
        width: "75%",
    },
    searchButton: {
        backgroundColor: "#04CFA4",
        borderRadius: 30,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    searchButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    emptySpace: {
        width: '20%',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 10, borderRadius: 10,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        position: 'absolute',
        marginTop: heightPercentageToDP(17),
        maxHeight: heightPercentageToDP(30),

        zIndex: 10
    },
    modalContent: {


    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000'
    },
    historyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    historyText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000'
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#04CFA4',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});