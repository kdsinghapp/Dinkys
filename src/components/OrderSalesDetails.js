import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../utils/Constant';
import Theme from '../theme';
import MyText from '../elements/MyText';


const OrderSalesDetails = ({
    isVisible = false,
    onBackdropPress = () => { },
    onDone = () => { },
    data,
}) => {
    const insets = useSafeAreaInsets();

    const Button = ({
        buttonTitle = 'Button',
        titleColor = '#FFF',
        style,
        onPress = () => { },
        iconCompoennet,
        disabled = false,
    }) => {
        return (
            <TouchableOpacity
                disabled={disabled}
                activeOpacity={0.5}
                onPress={onPress}
                style={[styles.buttonStyle, style, disabled && styles.disableStyle]}>
                {iconCompoennet && iconCompoennet}
                <MyText h5 style={{ color: "#fff", fontWeight: "700" }}>
                    {buttonTitle}
                </MyText>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            animationInTiming={500}
            animationOutTiming={400}
            useNativeDriver
            useNativeDriverForBackdrop
            animationOut={'slideOutDown'}
            animationIn={'slideInUp'}
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            backdropOpacity={0.2}
            style={{ padding: 0, margin: 0, zIndex: 2 }}>
            <View
                pointerEvents="box-none"
                style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                    style={[
                        styles.modalChildContainer,
                        {
                            paddingBottom: insets.bottom,
                        },
                    ]}>
                    <MyText h3 bold style={{ alignSelf: "center", marginTop: 15 }} >Order Details</MyText>

                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12,borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                        <View style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden" }}>
                            <Image source={{ uri: data?.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                {data?.title}
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                Colour: Made Blue
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12,borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                    <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/Total3x.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                {"Total"}
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                $ {data?.price}
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12,borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                    <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/User.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                {"Sold by"}
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                Prateek
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12,borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                    <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/AddressShiping3x.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                Shipping address
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                {data?.product_location}
                            </MyText >
                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12,borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                    <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/Paymentmethod3x.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                Payment method
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                Card Payment
                            </MyText >
                        </View>
                    </View>
                    {/* {data?.status == "wind" ?
                        <Button
                            buttonTitle={"Inprogress"}
                            onPress={()=>onDone(data?.id,"inprogress")}
                        />
                        :
                        data?.status == "inprogress"
                            ?
                            <Button
                                buttonTitle={"Complete"}
                                onPress={()=>onDone(data?.id,"complete")}
                            />
                            :
                            null
                    } */}
                </View>
            </View>
        </Modal>
    );
};

export default OrderSalesDetails;

const styles = StyleSheet.create({
    modalChildContainer: {
        backgroundColor: '#FFF',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp(90),
        padding: 20
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(7),
        justifyContent: 'space-between',
        backgroundColor: Theme.BUTTON_PRIMARY_COLOR,
        height: hp(7),
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    listContainer: {
        paddingBottom: hp(3),
    },
    buttonStyle: {
        borderRadius: 10,
        height: hp(6),
        backgroundColor: Theme.BUTTON_PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        marginBottom: hp(1.5),
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        marginVertical: hp(5),
    },
    disableStyle: {
        backgroundColor: 'lightgray',
    },
});