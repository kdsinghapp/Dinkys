/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ImageBackground, Platform, Text } from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import MyText from '../../elements/MyText'
import AddPhoto from "../../assets/svg/AddPhoto.svg"
import ProRight from "../../assets/svg/proright.svg"
import MyButton from '../../elements/MyButton'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import { errorToast, successToast } from '../../utils/customToast'
import SingleExperties from '../../components/SingleExerpties'
import CountryModal from '../../components/CountryModal'
import StateModal from '../../components/StateModal'
import CityModal from '../../components/CityModal'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import UploadImageModal from '../../components/UpdateProfileModal'
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux'

const AddProduct = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [title, setTitle] = useState()
    const [des, setDes] = useState()
    const [price, setPrice] = useState()
    const [zip, setZip] = useState("")
    const [categories, setCategories] = useState([]);
    const [categoriesData, setCategoriesData] = useState("Category");
    const [openCate, setopenCate] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [countryData, setCountryData] = useState('Country');
    const [countryList, setCountryList] = useState([]);
    const [stateOpen, setStateOpen] = useState(false);
    const [stateData, setStateData] = useState('State');
    const [stateList, setStateList] = useState([]);
    const [cityOpen, setCityOpen] = useState(false);
    const [cityData, setCityData] = useState('City');
    const [cityList, setCityList] = useState([]);
    const [hastagOpen, sethastagOpen] = useState(false);
    const [hastagData, sethastagData] = useState('');
    const [hastagList, sethastagList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [PickupLocationlat, setPickupLocationlat] = useState({
        lat: "",
        lng: "",
        place: ""
    });
    const [brand, setBrand] = useState("")
    const [status, setStatus] = useState("")
    const [imageOpen, setImageOpen] = useState(false)
    const [imageData, setImageData] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            _get_allCatergories()
            _get_Country()
            _get_Hastag()
        }, [])
    )
    const _get_Hastag = () => {
        setLoading(true)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_hash_tag`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    sethastagList(res?.data)
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }
    const _get_City = (value) => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append('state_id', value);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_city`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setCityList(res?.data)
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _get_State = (value) => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append('country_id', value);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_state`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setStateList(res?.data)
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _get_Country = () => {
        setLoading(true)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_country`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setCountryList(res?.data)
                } else {
                    errorToast(res?.message, 3000)
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

    const uploadHandler = () => {
        if (!title || !des || !price) {
            errorToast("All Fields Required", 3000)
        } else if (PickupLocationlat?.place?.length == 0) {
            errorToast("Please enter location", 3000)
        } else if (imageData?.length == 0) {
            errorToast("Please upload at least 1 image")
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("user_id", userDetailData?.id);
            formdata.append("title", title);
            formdata.append("price", price);
            formdata.append("category_id", categoriesData?.id);
            formdata.append("country_id", countryData?.id);
            formdata.append("state_id", stateData?.id);
            formdata.append("city_id", cityData?.id);
            formdata.append("zip_code", zip);
            formdata.append("brand", brand);
            formdata.append("hashtag_id", hastagData?.id);
            formdata.append("product_location", PickupLocationlat?.place);
            formdata.append("lat", PickupLocationlat?.lat);
            formdata.append("long", PickupLocationlat?.lng);
            formdata.append("description", des)
            imageData.forEach((image, index) => {
                return (
                    formdata.append(`images[]`, {
                        uri: Platform.OS == "android" ? image.path : image.path?.replace("file://", ""),
                        name: "image.png",
                        type: image.mime
                    }))
            });
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}add_product`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.status == "1") {
                        successToast("Product Add Successfully", 3000)
                        navigation.goBack()
                    } else {
                        errorToast(res?.messages?.error, 3000)
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }
    const _launchCamera = async () => {
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true,
            includeExif: true,
        })
            .then(image => {
                setImageData([...imageData, image])
                setImageOpen(false);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const _launchGallery = async () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true,
            includeExif: true,
        })
            .then(image => {
                setImageData([...imageData, image])
                setImageOpen(false);
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Add Product"} />
            <Text style={{fontSize:18,color:'#000',marginHorizontal:20,marginVertical:10,fontWeight:'700'}}> Product Location</Text>
            <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: 12,
                        borderColor: "#EBEBEB",
                        borderWidth: 1,
                        marginHorizontal:15
                    }}>

                    <GooglePlacesAutocomplete
                        scrollEnabled={false}
                        fetchDetails={true}
                        GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                        placeholder={"Product Location"}
                        onPress={(data, details = null) => {
                            setPickupLocationlat({ ...PickupLocationlat, lat: details?.geometry?.location?.lat, lng: details?.geometry?.location?.lng, place: data.description });
                        }}
                        styles={{
                            description: {
                                fontWeight: 'bold',
                                color: 'black',
                                width: '100%',
                            },
                            container: {
                                padding:5,
                            },
                            textInput: {
                                fontSize: 13,
                                color: '#000',
                                height: '100%',
                                width: '100%',
                            },
                        }}
                        textInputProps={{
                            placeholderTextColor: "#000"
                        }}
                        query={{
                            key: 'AIzaSyBQDSvBppnW59UJ0ALOlGV5aMiJl6bgk70',
                            language: 'en',
                        }}
                    />
                </View>
            <ScrollView style={{ flex: 1, padding: 20, paddingTop: 0 }}>
                <MyText h4 bold style={{ color: "#000" }}>Photo</MyText>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 12, flexWrap: "wrap", gap: 10 }}>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[0]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[0]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[1]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[1]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[2]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[2]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[3]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[3]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[4]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[4]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[5]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[5]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[6]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[6]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[7]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[7]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[8]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[8]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                    <Pressable onPress={() => setImageOpen(true)} style={{}}>
                        {!imageData?.[9]?.path ?
                            <AddPhoto width={60.50} height={60.50} />
                            :
                            <Image source={{ uri: imageData?.[9]?.path }} style={{ width: 60.50, height: 60.50, borderRadius: 12 }} />
                        }
                    </Pressable>
                </View>
               
                <TextInput value={title} placeholder='Title' placeholderTextColor={"#000"} onChangeText={(e) => setTitle(e)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15 }} />
                <TextInput multiline value={des} placeholder='Discription' placeholderTextColor={"#000"} onChangeText={(e) => setDes(e)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginVertical: 12 }} />
            
                <Pressable onPress={() => setopenCate(true)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <MyText h6 regular style={{ color: "#000" }}>{!categoriesData?.category_name ? "Category" : categoriesData?.category_name}</MyText>
                    <ProRight width={12} height={12} />
                </Pressable>
                <Pressable onPress={() => setCountryOpen(true)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <MyText h6 regular style={{ color: "#000" }}>{!countryData?.name ? "Country" : countryData?.name}</MyText>
                    <ProRight width={12} height={12} />
                </Pressable>
                <Pressable onPress={() => setStateOpen(true)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <MyText h6 regular style={{ color: "#000" }}>{!stateData?.name ? "State" : stateData?.name}</MyText>
                    <ProRight width={12} height={12} />
                </Pressable>
                <Pressable onPress={() => setCityOpen(true)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <MyText h6 regular style={{ color: "#000" }}>{!cityData?.name ? "City" : cityData?.name}</MyText>
                    <ProRight width={12} height={12} />
                </Pressable>
                <TextInput value={zip} placeholder='Zip Code' placeholderTextColor={"#000"} onChangeText={(e) => setZip(e)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginVertical: 15, }} />
                <TextInput value={brand} placeholder='Brand' placeholderTextColor={"#000"} onChangeText={(e) => setBrand(e)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15 }} />
                <TextInput value={status} placeholder='Products Status' placeholderTextColor={"#000"} onChangeText={(e) => setStatus(e)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginVertical: 15, }} />
                <Pressable onPress={() => sethastagOpen(true)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <MyText h6 regular style={{ color: "#000" }}>{!hastagData?.hash_tag_name ? "Hastag" : hastagData?.hash_tag_name}</MyText>
                    <ProRight width={12} height={12} />
                </Pressable>
                {hastagOpen && (
                    <View style={{ width: "100%", borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 12, marginBottom: 15, padding: 15 }}>
                        {hastagList?.length == 0 ? null :
                            hastagList.map((item, index) => {
                                return (
                                    <Pressable onPress={() => { sethastagData(item), sethastagOpen(false) }} key={index} style={{ padding: 5 }}>
                                        <MyText h5 bold >{item?.hash_tag_name}</MyText>
                                    </Pressable>
                                )
                            })
                        }
                    </View>
                )}
                <TextInput value={price} placeholder='Price' placeholderTextColor={"#000"} onChangeText={(e) => setPrice(e)} style={{ borderColor: "#EBEBEB", borderWidth: 1, borderRadius: 12, padding: 15, marginVertical: 15, }} />
                <MyButton title={"Post Add"} loading={loading} onPress={uploadHandler} style={{ borderRadius: 12 }} />
            </ScrollView>
            <SingleExperties
                isVisible={openCate}
                onBackdropPress={() => setopenCate(false)}
                onDone={(e) => { setCategoriesData(e), setopenCate(false) }}
                data={categories}
                loading={loading}
            />
            <CountryModal
                isVisible={countryOpen}
                onBackdropPress={() => setCountryOpen(false)}
                onDone={(e) => { setCountryData(e), setCountryOpen(false), _get_State(e?.id) }}
                data={countryList}
                loading={loading}
            />
            <StateModal
                isVisible={stateOpen}
                onBackdropPress={() => setStateOpen(false)}
                onDone={(e) => { setStateData(e), setStateOpen(false), _get_City(e?.id) }}
                data={stateList}
                loading={loading}
            />
            <CityModal
                isVisible={cityOpen}
                onBackdropPress={() => setCityOpen(false)}
                onDone={(e) => { setCityData(e), setCityOpen(false) }}
                data={cityList}
                loading={loading}
            />
            <UploadImageModal
                shown={imageOpen}
                onBackdropPress={() => setImageOpen(false)}
                onPressCamera={_launchCamera}
                onPressGallery={_launchGallery}
            />
        </View>
    )
}

export default AddProduct