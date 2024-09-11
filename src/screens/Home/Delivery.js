
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import PinSvg from "../../assets/svg/pin.svg"
import PickSvg from "../../assets/svg/Pick.svg"
import PersonSvg from "../../assets/svg/person.svg"
import TargetSvg from "../../assets/svg/radio.svg"
import MyButton from '../../elements/MyButton'
import HeaderTwo from '../../components/Header'


const Delivery = ({ navigation, route }) => {
    const { details } = route?.params
    const [show, setShow] = useState("person")

    const _next = () => {
        if (show == "person") {
            navigation.navigate("Map", { details })
        } else if (show == "pick") {
            navigation.navigate("Summary", { details, address: { lat: 22.2424, lon: 75.5353, place: "Vijay Nagar" }, shipping_charge: Math.ceil(0.7 * 5) })
        } else {
            navigation.navigate("Summary", { details, address: { lat: 22.2424, lon: 75.5353, place: "BhawarKuaa" }, shipping_charge: Math.ceil(0.9 * 5) })

        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Delivery"} />
            <View style={{ backgroundColor: "#fff", flex: 1, padding: 20, paddingTop: 0 }}>
                <Pressable onPress={() => setShow("person")} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PersonSvg width={34} height={34} />
                    <View style={{ width: "70%" }}>
                        <MyText h5 bold style={{ color: "#1C1B1B" }}>
                            In person
                        </MyText >
                        <MyText h6 regular style={{ color: "#C3C6C9" }}>
                            Meet and pay without leaving the app when you are with the seller
                        </MyText >
                    </View>
                    {show == "person" ? <TargetSvg width={30} height={30} /> : <View style={{ width: 30, height: 30, borderWidth: 1, borderRadius: 30 / 2, borderColor: "#04CFA4" }} />}
                </Pressable>
                <Pressable onPress={() => setShow("pick")} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PickSvg width={34} height={34} />
                    <View style={{ width: "70%" }}>
                        <MyText h5 regular style={{ color: "#1C1B1B" }}>
                            Pick-up point 3.99 €
                        </MyText >
                    </View>
                    {show == "pick" ? <TargetSvg width={30} height={30} /> : <View style={{ width: 30, height: 30, borderWidth: 2, borderRadius: 30 / 2, borderColor: "#04CFA4" }} />}
                </Pressable>
                <Pressable onPress={() => setShow("address")} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PinSvg width={34} height={34} />
                    <View style={{ width: "70%" }}>
                        <MyText h5 regular style={{ color: "#1C1B1B" }}>
                            My address 4.99 €
                        </MyText >
                    </View>
                    {show == "address" ? <TargetSvg width={30} height={30} /> : <View style={{ width: 30, height: 30, borderWidth: 2, borderRadius: 30 / 2, borderColor: "#04CFA4" }} />}
                </Pressable>
            </View>
            <View style={{ backgroundColor: "#fff", margin: 20 }}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, elevation: 5 }}>
                    <View style={{ width: 133, height: 133, borderRadius: 12, overflow: "hidden" }}>
                        <Image source={{ uri: details?.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                    </View>
                    <View style={{}}>
                        <MyText h4 bold style={{ color: "#1C1B1B" }}>
                            {details?.title}
                        </MyText >
                        <MyText h5 regular style={{ color: "#C3C6C9" }}>
                            Colour: Made Blue
                        </MyText >
                        <MyText h5 bold style={{ color: "#04CFA4" }}>
                            € {details?.price}
                        </MyText >
                    </View>
                </View>
            </View>
            <MyButton onPress={_next} title={"Continue"} style={{ borderRadius: 12, marginBottom:10, width: "95%", alignSelf: "center" }} />
        </View>
    )
}

export default Delivery