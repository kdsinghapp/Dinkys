
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ImageBackground, ActivityIndicator } from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TargetSvg from "../../assets/svg/Target.svg"
import { DOMAIN } from '../../services/Config';


const Map = ({ navigation, route }) => {
    const { details } = route?.params
    const [PickupLocationlat, setPickupLocationlat] = useState({
        lat: "",
        lng: "",
        place: ""
    });
    const [loading, setLoading] = useState(false)

    console.log("details",details?.lat)

    useEffect(() => {
        if (PickupLocationlat?.place?.length !== 0) {
            setLoading(true)
            var formdata = new FormData();
            formdata.append("lat_pikup", Number(details?.lat));
            formdata.append("long_pikup", Number(details?.long));
            formdata.append("lat_droup", PickupLocationlat?.lat);
            formdata.append("long_droup", PickupLocationlat?.lng);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            console.log("formdata",formdata?._parts)
            fetch(`${DOMAIN}get-distance`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    console.log("res",res)
                    if (res?.status == "1") {
                        navigation.navigate("Summary", { details, address: PickupLocationlat, shipping_charge: Math.ceil(res?.result * 5) })
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }, [PickupLocationlat?.place])

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Delivery"} />
            <ImageBackground source={require("../../assets/dinkyimg/map.png")} style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
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
                <Pressable style={{ position: "absolute", bottom: 30, right: 20, width: 60, height: 60, borderRadius: 60 / 2, backgroundColor: "#04CFA4", justifyContent: "center", alignItems: "center" }}>
                    {loading ? <ActivityIndicator size={"small"} />
                        :
                        <TargetSvg width={60} height={60} />
                    }
                </Pressable>
            </ImageBackground>

        </View>
    )
}

export default Map