
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { TextInput, View, Pressable, ScrollView, Image, Platform,Text } from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import Theme from '../../theme'
import ImagePicker from 'react-native-image-crop-picker';
import { get_country, get_state, update_profile } from '../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import UploadImageModal from '../../components/UpdateProfileModal'
import { successToast } from '../../utils/customToast'
import HeaderTwo from '../../components/Header'
import { DOMAIN } from '../../services/Config'
const EditProfile = ({ route }) => {
    const { userDetails } = route?.params
    const userDetailData = useSelector((state) => state.user.user)
    const navigation = useNavigation()
    const [name, setName] = useState(userDetails?.user_name)
    const [number, setNumber] = useState(userDetails?.mobile)
    const [image, setImage] = useState("")
    const [dob, setDob] = useState(userDetails?.dob)
    const [email, setEmail] = useState(userDetails?.email)
    const [loading, setLoading] = useState(false)
    const [uplaodImageModal, setUploadImageModal] = useState(false);
    const [gender, setGender] = useState(userDetails?.gender)
    const [address, setAddress] = useState(userDetails?.address)

    const dispatch = useDispatch()

    const updateProfile = () => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userDetailData?.access_token}`);
        var formdata = new FormData();
        formdata.append('user_id', userDetails?.id);
        formdata.append('user_name', name);
        formdata.append('email', email);
        formdata.append('mobile', number);
        formdata.append('gender', gender);
        formdata.append('address', address);
        formdata.append('dob', dob);
        formdata.append('profile_picture', image.length === 0 ? "" : {
            uri: Platform.OS == "android" ? image.path : image.path?.replace("file://", ""),
            name: "image.png",
            type: image.mime
        });
        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`${DOMAIN}update-profile`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    navigation.navigate("Bottomtab")
                } else {
                    errorToast(res?.message, 3000)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
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
                setImage(image)
                setUploadImageModal(false);
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
                setImage(image)
                setUploadImageModal(false);
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Edit Profile"} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
                <View style={{ backgroundColor: "#fff", flex: 1 }}>
                    {image?.length === 0 ?
                        <Pressable onPress={() => setUploadImageModal(true)} style={{ borderWidth: 2, width: 100, height: 100, borderRadius: 100 / 2, borderColor: "#415893", alignSelf: "center", overflow: "hidden", marginVertical: 20 }}>
                            {userDetails?.image?.length === 0 ? null : <Image source={{ uri: userDetails?.image }} style={{ width: "100%", height: "100%" }} />}
                        </Pressable>
                        :
                        <Pressable onPress={() => setUploadImageModal(true)} style={{ borderWidth: 2, width: 100, height: 100, borderRadius: 100 / 2, borderColor: "#415893", alignSelf: "center", overflow: "hidden", marginVertical: 20 }}>
                            {image?.length === 0 ? null : <Image source={{ uri: image.path }} style={{ width: "100%", height: "100%" }} />}
                        </Pressable>
                    }
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Full Name"}
                        </Text >
                        <TextInput value={name} keyboardType="default" onChangeText={(e) => setName(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Name' placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Email"}
                        </Text >
                        <TextInput value={email} keyboardType="default" style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Email' placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Location"}
                        </Text >
                        <TextInput value={address} keyboardType="default" onChangeText={(e) => setAddress(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Location' placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Gender"}
                        </Text >
                        <TextInput value={gender} keyboardType="default" onChangeText={(e) => setGender(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Gender' placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Birthdate"}
                        </Text >
                        <TextInput value={dob} keyboardType="default" onChangeText={(e) => setDob(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Dob' placeholderTextColor={"#000"} />
                    </View>
                    {/* <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Phone Number"}
                        </Text >
                        <TextInput value={number} keyboardType="default" onChangeText={(e) => setNumber(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Dob' placeholderTextColor={"#000"} />
                    </View> */}
                </View>
<View    style={{height:60}}/>
            </ScrollView >
            <MyButton loading={loading} onPress={updateProfile} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30 }} style={{ borderRadius: 16, width: "95%", alignSelf: "center", margin: 10 }} title={"Save"} />
            <UploadImageModal
                shown={uplaodImageModal}
                onPressCamera={_launchCamera}
                onPressGallery={_launchGallery}
                onBackdropPress={() => setUploadImageModal(false)}
            />
        </View>)
}

export default EditProfile