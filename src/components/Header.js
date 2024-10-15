import React, { useRef, useState } from 'react'
import { Alert, Animated, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MyText from '../elements/MyText'
import BackNav from "../assets/svg/BackNav.svg"

const HeaderTwo = ({ title, navigation, back, subtitle, Metting }) => {

    return (
        <View style={styles.container}>
            <Pressable style={{ position: "absolute", left: 25 }} onPress={() => {

                if (Metting) {
                  

                    Alert.alert(
                        "Close Page", // Alert title
                        "Do you want to close this page? If you close it then you will have to pay to come to this page again.", // Alert message
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel" // optional styling for cancel
                          },
                          {
                            text: "Close",
                            onPress: () =>   navigation.navigate('Bottomtab'),
                            style: "destructive" // optional destructive style for close
                          }
                        ],
                        { cancelable: false } // prevent closing by tapping outside the alert
                      );
                }
                else {
                    navigation.goBack()
                }
            }}>
                {back ? null : <BackNav width={32} height={32} />}
            </Pressable>
            <Text style={{ color: "#000", fontWeight: '700', fontSize: 20 }} >{title}</Text>
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