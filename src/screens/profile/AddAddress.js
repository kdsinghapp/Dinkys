
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, ActivityIndicator } from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TargetSvg from "../../assets/svg/Target.svg"
import { DOMAIN } from '../../services/Config';
import { useSelector } from 'react-redux';
import MyButton from '../../elements/MyButton';
import Theme from '../../theme';
import { errorToast, successToast } from '../../utils/customToast';


const AddAddress = ({ navigation, route }) => {
    const userDetails = useSelector((state) => state?.user?.user)
    const [PickupLocationlat, setPickupLocationlat] = useState({
        lat: "",
        lng: "",
        place: ""
    });
    const [loading, setLoading] = useState(false)

    const add_address = () => {
        if (PickupLocationlat?.place?.length == 0) {
            errorToast("Please Enter Location")
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("user_id", userDetails?.id);
            formdata.append("location", PickupLocationlat.place);
            formdata.append("lat", PickupLocationlat.lat);
            formdata.append("lon", PickupLocationlat?.lng);
            formdata.append("type", "Home");
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}add_address`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res?.status == "1") {
                        successToast("Address Added Successfully", 3000)
                        navigation.navigate("Bottomtab")
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Add Address"} />
            <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        backgroundColor: 'white',
                        elevation: 3,
                        shadowColor: 'black',
                        borderRadius: 3,
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        padding: 10,
                        shadowOpacity: 0.15,
                        shadowRadius: 2.84,
                        borderRadius: 12
                    }}>

                    <GooglePlacesAutocomplete
                        scrollEnabled={false}
                        fetchDetails={true}
                        GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                        
                        placeholder={"Enter Location"}
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
                                padding: 5,
                                
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
                <MyButton title="Add" onPress={add_address} loading={loading} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30 }} style={{ borderRadius: 16, width: "100%", alignSelf: "center", position: "absolute", bottom: 10 }} />
            </View>

        </View>
    )
}

export default AddAddress