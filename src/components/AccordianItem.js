import React, { useRef, useState } from 'react'
import { Animated, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import MyText from '../elements/MyText'
import FAQSvg from "../assets/svg/faqArrow.svg"
const AccirdianItem = ({ title, des }) => {
    const [content, setContent] = useState(false)
    const animationController = useRef(new Animated.Value(0)).current

    const toggleListItem = () => {
        const config = {
            durantion: 300,
            toValue: content ? 0 : 1,
            useNativeDriver: true
        }
        Animated.timing(animationController, config).start()
        setContent(!content)
    }

    const arrowTransform = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"]
    })
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleListItem}>
                <View style={styles.titleContainer}>
                    <MyText h5 bold style={{ color: "#04CFA4", width: "95%" }} >
                        {title}
                    </MyText>
                    <Animated.View style={{ width: 20, height: 20, transform: [{ rotateZ: arrowTransform }] }}>
                        <FAQSvg width={24} height={24} />
                    </Animated.View>
                </View>
            </TouchableOpacity>
            {content && (
                <View style={styles.desContainer}>
                    <MyText h5 semibold style={{ color: "#000" }}>
                        {des}
                    </MyText>
                </View>
            )}
        </View>
    )
}
export default AccirdianItem

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#F4F8FF",
        overflow: "hidden",
        marginBottom: 15,
        padding: 15,
        borderRadius: 15

    },
    desContainer: {
        paddingVertical: "3%"
    },
    titleContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }

})