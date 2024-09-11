
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react'
import {
    Image, View,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { CommonActions } from '@react-navigation/native'
import LogoSvg from "../../assets/svg/logo_white.svg"
import MyStatusBar from '../../elements/MyStatusBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Splash = ({ route, navigation }) => {

    const dispatch = useDispatch()

    const moveForward = (name) => {
        setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: name }]
                })
            )
        }, 1000)
    }

    const moveToHome = async () => {
        const user = await AsyncStorage.getItem('@USER')
        if (user !== null) {
            dispatch({ type: 'SET_USER', payload: JSON.parse(user) || {} })
            moveForward('Bottomtab')
        } else {
            moveForward('ChooseLanguage')
        }
    }

    useEffect(() => {
        setTimeout(() => {
            moveToHome()
        }, 1000);
        return () => null
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
            <MyStatusBar backgroundColor={"#000"} barStyle={"ligh-content"} />
            <LogoSvg width={219.29} height={94.67} />
        </View>
    )
}

export default Splash