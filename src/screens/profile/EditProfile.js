
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { TextInput, View, Pressable, ScrollView, Image, Platform, Text,ActivityIndicator } from 'react-native'
import MyText from '../../elements/MyText'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
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
import localizationStrings from '../Localization/Localization'
import { hp } from '../../utils/Constant'
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
    const [user, setUser] = useState(null)


    useEffect(()=>{
        setName(user?.user_name)
        setNumber(user?.mobile)
        setDob(user?.dob)
        setEmail(user?.email)
        setGender(user?.gender)
        setAddress(user?.address)



    },[user])
    useFocusEffect(
        React.useCallback(() => {
            _get_profile()
        }, [userDetailData])
    )

    const _get_profile = () => {
        setLoading(true)
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
                setLoading(false)
                if (res.status == "1") {
                    dispatch({ type: "WALLET", payload: res?.data?.wallet });
                    setUser(res?.data)
                }
            }).catch((err) => {
                console.log("err", err)
                setLoading(false)
            })
    }



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

{loading?<View style={{flex:1,justifyContent:'center',alignItems:'center',
        zIndex:2,
        position:'absolute',alignSelf:'center',top:hp(50)}}>

        <ActivityIndicator size={40} color={'#0BD89E'} />
        </View>
        :null}
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={localizationStrings.edit_profile} />
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

                    <View style={{position:'absolute',top:hp(11),left:hp(22)}}>
                    {userDetailData?.label === 'professional'&&<Image source={require('../../assets/verified.png')}  style={{height:30,width:30,marginLeft:20}} />}
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                            {localizationStrings.full_name}
                        </Text >
                        <TextInput value={name} keyboardType="default"

                            onChangeText={(e) => setName(e)} style={{ width: "100%", borderRadius: 10, color: '#000' }}
                            placeholder={localizationStrings.full_name} placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                        {localizationStrings.email}
                        </Text >
                        <TextInput value={email} keyboardType="default" style={{ width: "100%", color: '#000', borderRadius: 10 }} placeholder={localizationStrings.email} placeholderTextColor={"#000"} />
                    </View>
                    {/* <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                        {localizationStrings.location}
                        </Text >
                        <TextInput value={address} keyboardType="default" onChangeText={(e) => setAddress(e)}
                            style={{ width: "100%", color: '#000', borderRadius: 10 }} placeholder= {localizationStrings.location} placeholderTextColor={"#000"} />
                    </View> */}
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                        {localizationStrings.gender}
                        </Text >
                        <TextInput value={gender} keyboardType="default" onChangeText={(e) => setGender(e)}
                        
                        
                        style={{ width: "100%", borderRadius: 10,color:'#000' }} placeholder={localizationStrings.gender} placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                        {localizationStrings.mobile_number}
                        </Text >
                        <TextInput value={number} keyboardType="default" 
                        onChangeText={(e) => setNumber(e)} 
                        style={{ width: "100%", borderRadius: 10,color: '#000', }}
                         placeholder= {localizationStrings.mobile_number} placeholderTextColor={"#000"} />
                    </View>
                    <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, color: '#000', marginTop: 15 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                        {localizationStrings.bidobrth}
                        </Text >
                        <TextInput value={dob} keyboardType="default" onChangeText={(e) => setDob(e)}
                         style={{ color: '#000', width: "100%", borderRadius: 10 }} placeholder= {localizationStrings.bidobrth} placeholderTextColor={"#000"} />
                    </View>
                    {/* <View style={{ padding: 12, borderWidth: 1, borderColor: "#F4F5FD", borderRadius: 15, marginTop: 15 }}>
                        <Text style={{fontSize:16,color:'#000',fontWeight:'600'}}>
                            {"Phone Number"}
                        </Text >
                        <TextInput value={number} keyboardType="default" onChangeText={(e) => setNumber(e)} style={{ width: "100%", borderRadius: 10 }} placeholder='Enter Dob' placeholderTextColor={"#000"} />
                    </View> */}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView >
            <MyButton loading={loading} onPress={updateProfile} textStyle={{ fontSize: 18, fontWeight: "700", fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30 }} style={{ borderRadius: 16, width: "95%", alignSelf: "center", margin: 10 }} title={localizationStrings.save} />
            <UploadImageModal
                shown={uplaodImageModal}
                onPressCamera={_launchCamera}
                onPressGallery={_launchGallery}
                onBackdropPress={() => setUploadImageModal(false)}
            />
        </View>

    )
}

export default EditProfile