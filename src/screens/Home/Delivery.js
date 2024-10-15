
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert,Text, View, FlatList, TouchableOpacity, TextInput, BackHandler } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import PinSvg from "../../assets/svg/pin.svg"
import PickSvg from "../../assets/svg/Pick.svg"
import PersonSvg from "../../assets/svg/person.svg"
import TargetSvg from "../../assets/svg/radio.svg"
import MyButton from '../../elements/MyButton'
import HeaderTwo from '../../components/Header'
import MapPickerModal from '../../components/MapPicker'
import MyaddressModal from '../../components/MyaddressModal'
import { errorToast } from '../../utils/customToast'


const Delivery = ({ navigation, route }) => {
    const { details } = route?.params
    const [show, setShow] = useState("")
    const [pickupModalVisible, setpickupModalVisible] = useState(false)
    const [PickupLocation, setPickupLocation] = useState('')
    const [PickupLocationName, setPickupLocationName] = useState(false)
    
    const [addressModalVisible, setaddressModalVisible] = useState('')
    
    const [AddressLocationName, setAddressLocationName] = useState('')
    
    const [AddressLocation, setAddressLocation] = useState('')
 

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
    
        const toRadians = (degrees) => degrees * Math.PI / 180;
        
        lat1 = toRadians(lat1);
        lon1 = toRadians(lon1);
        lat2 = toRadians(lat2);
        lon2 = toRadians(lon2);
    
        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;
        const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
    
        return distance.toFixed(2); // Return distance rounded to 2 decimal places
    }
    

    
    const _next = () => {
        if (show == "person") {
          
            navigation.navigate("MeetAndPay", {  details, address: { lat:PickupLocation?.latitude, lon: PickupLocation?.longitude, place: PickupLocationName },shipping_charge:(Number(details?.at_collection_point)*Number(haversine(PickupLocation?.latitude, PickupLocation?.longitude, details?.lat, details?.long)))?.toFixed(2) })
        } else if (show == "pick") {
            if(!PickupLocation?.latitude || !PickupLocation?.longitude) return errorToast('PickupLocation a Location')
            navigation.navigate("Summary", { details, address: { lat:PickupLocation?.latitude, lon: PickupLocation?.longitude, place: PickupLocationName },shipping_charge:(Number(details?.at_collection_point)*Number(haversine(PickupLocation?.latitude, PickupLocation?.longitude, details?.lat, details?.long)))?.toFixed(2)  })
        } else {
            if(!AddressLocation?.latitude || !AddressLocation?.longitude) return errorToast('Add Address Location')
            navigation.navigate("Summary", { details, address: { lat: AddressLocation?.latitude, lon: AddressLocation?.longitude, place:AddressLocationName },shipping_charge:(Number(details?.at_my_address) * Number(haversine(AddressLocation?.latitude, AddressLocation?.longitude, details?.lat, details?.long))).toFixed(2) })

        }
    }


    
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Delivery"} />
            <View style={{ backgroundColor: "#fff", flex: 1, padding: 20, paddingTop: 0 }}>
                <Pressable onPress={() => {
                   
                    setShow("person")}} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PersonSvg width={34} height={34} />
                    <View style={{ width: "70%" }}>
                        <Text  style={{ color: "#000",fontWeight:'700',fontSize:16 }}>
                            In person
                        </Text >

                        <Text  style={{ color: "#C3C6C9",fontWeight:'500',fontSize:12 }}>
                            Meet and pay without leaving the app when you are with the seller
                        </Text >
                    </View>
                    {show == "person" ? <TargetSvg width={30} height={30} /> : <View style={{ width: 30, height: 30, borderWidth: 1, borderRadius: 30 / 2, borderColor: "#04CFA4" }} />}
                </Pressable>
                <Pressable onPress={() => {
                    setShow('pick')
                    setpickupModalVisible(true)}} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PickSvg width={34} height={34} />
                    <View style={{ width: "70%" }}>
               {!PickupLocation && <Text  style={{ color: "#000",fontWeight:'700',fontSize:16 }}>
                        Pick-up point €{details?.at_collection_point}
                    </Text >}
               {PickupLocation && <Text  style={{ color: "#000",fontWeight:'700',fontSize:16 }}>
                        Pick-up point €{(Number(details?.at_collection_point)*Number(haversine(PickupLocation?.latitude, PickupLocation?.longitude, details?.lat, details?.long)))?.toFixed(2)}
                    </Text >}

                        <Text style={{fontSize:10,color:'#424242'}}>{PickupLocationName}</Text>
                    </View>
                    {show == "pick" ? <TargetSvg width={30} height={30} /> : <View style={{ width: 30, height: 30, borderWidth: 2, borderRadius: 30 / 2, borderColor: "#04CFA4" }} />}
                </Pressable>
                <Pressable onPress={() => {
                    setaddressModalVisible(true)
                    setShow("address")}} style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 15, padding: 5, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#EDEDED" }}>
                    <PinSvg width={34} height={34} />
                    <View style={{ width: "70%" }}>
             {!AddressLocation &&       <Text  style={{ color: "#000",fontWeight:'700',fontSize:16 }}>
                            My address €{details?.at_my_address}
                        </Text >}
                        {AddressLocation && (
    <Text style={{ color: "#000", fontWeight: '700', fontSize: 16 }}>
        My address €{(Number(details?.at_my_address) * Number(haversine(AddressLocation?.latitude, AddressLocation?.longitude, details?.lat, details?.long))).toFixed(2)}
    </Text>
)}

                        <Text style={{fontSize:10,color:'#424242'}}>{AddressLocationName}</Text>
                        
                    </View>
                    {show == "address" ? <TargetSvg width={30} height={30} /> : <View style={{ width: 30, height: 30, borderWidth: 2, borderRadius: 30 / 2, borderColor: "#04CFA4" }} />}
                </Pressable>
            </View>
            <View style={{ backgroundColor: "#fff", margin: 20 }}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, elevation: 5 }}>
                    <View style={{ width: 100, height:100, borderRadius: 12, overflow: "hidden" }}>
                        <Image source={{ uri: details?.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                    </View>
                    <View style={{}}>
                    <Text  style={{ color: "#000",fontWeight:'700',fontSize:16 }}>
                            {details?.title}
                        </Text >
                      
                        <Text  style={{ color: "#C3C6C9",fontWeight:'500',fontSize:14 }}>
                            Colour: Made Blue
                        </Text >
                 
                        <Text  style={{ color: "#04CFA4",fontWeight:'700',fontSize:16 }}>
                            € {details?.price}.00
                        </Text >
                    </View>
                </View>
            </View>
            <MyButton onPress={_next} title={"Continue"} style={{ borderRadius: 12, marginBottom:10, width: "95%", alignSelf: "center" }} />
            <MapPickerModal    setModalVisible={setpickupModalVisible} modalVisible={pickupModalVisible}  sendLocation={setPickupLocation} setLocationName={setPickupLocationName}  />
  
            <MyaddressModal    setModalVisible={setaddressModalVisible} modalVisible={addressModalVisible} 
             sendLocation={setAddressLocation} setLocationName={setAddressLocationName}  />
     
        </View>
    )
}

export default Delivery