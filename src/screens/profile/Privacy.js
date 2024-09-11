
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Image, ImageBackground, Pressable, ScrollView, TextInput, View,
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import MyText from '../../elements/MyText'
import HeaderTwo from '../../components/Header'
const Privacy = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"About Us"} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 0, padding: 20 }}>
                <MyText h6 bold style={{ color: "#000000", }}>
                    Privacy Policy
                </MyText >
                <MyText h6 bold style={{ color: "#00000050", marginTop: 10 }}>
                    At STEMM Research, we understand the crucial role that visual documentation plays in the field of dentistry. To enhance this process, we have developed a user-friendly and feature-rich app that empowers patients and dental practitioners to take high-quality images with ease.
                </MyText >
                <MyText h6 bold style={{ color: "#000000", marginVertical:15 }}>
                    Interpretation
                </MyText >
                <MyText h6 bold style={{ color: "#00000050", }}>
                    STEMM Research is committed to pushing the boundaries of dental technology, and our FirstSightDentalTMApp is just the beginning. We strive to empower both patients and dental professionals worldwide with innovative solutions that promote equity, elevate quality of care, and provide useful services to the community, including vulnerable individuals and underrepresented minorities.
                    Download the FirstSightDentalTMApp by STEMM Research today and experience a new era of dental photography. Join us on our journey to revolutionize the way dental images are captured and utilized for improved patient outcomes.
                </MyText >
            </ScrollView>
        </View>
    )
}

export default Privacy