import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Pressable } from 'react-native';

import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../elements/Text';
import { hp, wp } from '../utils/Constant';
import Theme from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const LanguageModal = ({
    isVisible = false,
    onBackdropPress = () => { },
    onPressLanguage = () => { },
    languageValue = "eng",
    setlanguageValue
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
                <Text size={16} fontWeight="700" color={titleColor}>
                    {buttonTitle}
                </Text>
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
                    <View style={styles.modalHeader}>
                        <Text color="#FFF" fontWeight="700" size={20}>
                            Select Language
                        </Text>
                        <TouchableOpacity onPress={onBackdropPress} activeOpacity={0.7}>
                            <Ionicons name="close" color={'#FFF'} size={25} />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: wp(4),
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                        <View style={{ marginVertical: 10 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 10, justifyContent: "space-between" }}>
                                <Text color="#000" fontWeight="700" size={18}>
                                    English
                                </Text>
                                <Pressable onPress={() => setlanguageValue("English")} style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                                    <MaterialCommunityIcons name={languageValue === "English" ? "circle-slice-8" : "circle-outline"} size={30} color="#677294" />
                                </Pressable>
                            </View>

                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 10, justifyContent: "space-between" }}>
                                <Text color="#000" fontWeight="700" size={18}>
                                    Hindi
                                </Text>
                                <Pressable onPress={() => setlanguageValue('Hindi')} style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                                    <MaterialCommunityIcons name={languageValue === "Hindi" ? "circle-slice-8" : "circle-outline"} size={30} color="#677294" />
                                </Pressable>
                            </View>

                        </View>
                        <Button
                            buttonTitle={"Done"}
                            onPress={onPressLanguage}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LanguageModal;

const styles = StyleSheet.create({
    modalChildContainer: {
        backgroundColor: '#FFF',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp(40),
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
        width: '90%',
        alignSelf: 'center',
        marginVertical: hp(1),
    },
    disableStyle: {
        backgroundColor: 'lightgray',
    },
});