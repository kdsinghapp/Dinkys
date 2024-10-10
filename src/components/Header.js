import React, { useRef, useState } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MyText from '../elements/MyText'
import BackNav from "../assets/svg/BackNav.svg"

const HeaderTwo = ({ title, navigation, back, subtitle }) => {

    return (
        <View style={styles.container}>
            <Pressable style={{ position: "absolute", left: 25 }} onPress={() => navigation.goBack()}>
                {back ? null : <BackNav width={32} height={32} />}
            </Pressable>
            <Text  style={{ color: "#000",fontWeight:'700',fontSize:20 }} >{title}</Text>
        </View>
    )
}
export default HeaderTwo

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        justifyContent: "center",
        padding: 20,
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"

    },
})