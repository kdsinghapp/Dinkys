
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import {
    Pressable, View, TextInput, ScrollView, Image, Text, TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import { useDispatch, useSelector } from 'react-redux'
import ProRight from "../../assets/svg/proright.svg"
import HeaderTwo from '../../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import Ratting from '../Delivery/Ratting'
import localizationStrings from '../Localization/Localization'
import { Dropdown } from 'react-native-element-dropdown';
import { hp, wp } from '../../utils/Constant'
const Profile = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(null)
    const dispatch = useDispatch()

    const [value, setValue] = useState('French');
    const [languageChanged, setLanguageChanged] = useState(false);
      const [items] = useState([
      
      
      { label: 'English', value: 'English', flag: require('../../assets/usa.png') },
      { label: 'Spanish', value: 'Spanish', flag: require('../../assets/spain.png') },
   
      
      // Add more languages here
    ]);

    const handleChangeLanguage =async (language) => {
        localizationStrings.setLanguage(language);
        await AsyncStorage.setItem("Lng", language)
    
    
        setValue(language);
        setLanguageChanged(prev => !prev);
      };
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

    return (
        <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>

       {loading?<View style={{flex:1,justifyContent:'center',alignItems:'center',
        zIndex:2,
        position:'absolute',alignSelf:'center',top:hp(50)}}>

        <ActivityIndicator size={40} color={'#0BD89E'} />
        </View>
        :null}
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} back={true} title={localizationStrings.profile} />
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('EditProfile', { userDetails: user })
                    }}
                    style={{ alignItems: "center", backgroundColor: "#fff", flexDirection: "row", padding: 25, justifyContent: "space-between" }}>
                    <View style={{ width: 80, height: 80, borderRadius: 80 / 2, borderWidth: 0.5, overflow: "hidden" }}>
                        {user?.image?.length === 0 ? null : <Image source={{ uri: user?.image }} style={{ width: "100%", height: "100%", borderRadius: 80 / 2 }} />}
                    </View>
                    <View style={{ width: "60%" }}>
                        <Text style={{ color: '#1D3A70', fontWeight: '700', fontSize: 18 }}>{user?.user_name}  {user?.label === 'professional'&&<Image source={require('../../assets/verified.png')}  style={{height:20,width:20,marginLeft:20}} />}</Text>
                        <Text style={{ color: '#666666', fontWeight: '600', fontSize: 12 }}>{user?.email}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10, marginTop: 10 }}>
                            <Ratting Ratting={user?.rating} />
                            <Text style={{ marginLeft: 15, color: '#000', fontWeight: '600' }}>{user?.rating}</Text>
                        </View>
                    </View>
                    <ProRight width={16} height={16} />
                </TouchableOpacity>
                <View style={{ backgroundColor: "transparent", padding: 25, justifyContent: "space-between", paddingVertical: 20 }}>
                    <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 18 }} >{localizationStrings.transaction}</Text>
                </View>
                <View style={{ backgroundColor: "#fff", padding: 25, }}>

                    <Pressable
                        onPress={() => navigation.navigate("Metting")}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.metting_req}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                </View>
                <View style={{ backgroundColor: "#fff", padding: 25, }}>

                    <Pressable
                        onPress={() => navigation.navigate("Purchases")}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.purchase}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate("Sales")}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 30 }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.sales}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate("Wallet", { user })}
                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.wallet}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                </View>
                <View style={{ backgroundColor: "transparent", padding: 25, justifyContent: "space-between", paddingVertical: 20 }}>
                    <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 18 }} >{localizationStrings.account}</Text>
                </View>
                <View style={{ backgroundColor: "#fff", padding: 25, }}>
                    <Pressable onPress={() => user == null ? null : navigation.navigate("SettingScreen", { userDetails: user })} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.setting}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable

                        onPress={() => user == null ? null : navigation.navigate("Help", { userDetails: user })}

                        style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 30 }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.help}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                    <Pressable onPress={() => {
                        AsyncStorage.clear(),
                            dispatch({ type: 'SET_USER', payload: null }),
                            navigation.navigate("Login")
                    }} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.logout}</Text>
                        <ProRight width={24} height={24} />
                    </Pressable>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',height:60,backgroundColor:'#fff',paddingHorizontal:40,

alignSelf:'center'
}}>

<Image
style={{ height: 25, width: 25, marginTop: 10 }}
resizeMode="contain"
source={items.find(item => item.value === value)?.flag}
/>
<Dropdown
style={styles.dropdown}
data={items}
itemTextStyle={{color:'#000'}}
placeholderStyle={{color:'#000'}}
labelField="label"
valueField="value"
placeholder="Select Language"
selectedTextStyle={{
color:"#000"
}}
value={value}
dropdownPosition='top'
onChange={item => handleChangeLanguage(item.value)}
/>
</View>
                {(user?.driver_details_data || user?.driver_data) &&
                    <>
                        <View style={{ backgroundColor: "transparent", padding: 25, justifyContent: "space-between", paddingVertical: 20 }}>
                            <Text style={{ color: "#04CFA4", fontWeight: '700', fontSize: 18 }} >{localizationStrings.driver_details}</Text>
                        </View>
                        <View style={{ backgroundColor: "#fff", padding: 25, }}>
                            {user?.driver_data && <Pressable onPress={() => navigation.navigate("DriverProfile")} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.details}</Text>
                                <ProRight width={24} height={24} />
                            </Pressable>}
                            {user?.driver_details_data && <Pressable
                                onPress={() => {
                                    navigation.navigate('DriverDocument')
                                }}
                                style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 30 }}>
                                <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>{localizationStrings.document}</Text>
                                <ProRight width={24} height={24} />
                            </Pressable>}

                        </View>
                    </>
                }
 
            </ScrollView>

        </View >
    )
}

export default Profile

const styles = StyleSheet.create({

    dropdown: {
        marginLeft:10,
        marginTop:10,
         height:40,
     justifyContent:'center',
         width:'100%',
         alignSelf:'center',
         //backgroundColor:'#fff',
        
       
       },
})