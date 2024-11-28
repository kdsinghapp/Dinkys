
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Text, StyleSheet, View, Pressable
} from 'react-native'
import MyText from '../../elements/MyText'
import { useNavigation } from '@react-navigation/core'
import MyButton from '../../elements/MyButton'
import MyStatusBar from '../../elements/MyStatusBar'
import { errorToast } from '../../utils/customToast'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from
    'react-native-confirmation-code-field';
import BackNav from "../../assets/svg/BackNav.svg"
import Theme from '../../theme'
import { DOMAIN } from '../../services/Config'
import localizationStrings from '../Localization/Localization'
const CELL_COUNT = 4;
const Otp = ({ route }) => {
    const { showNumber, email, number } = route?.params
    const navigation = useNavigation()
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const otpHandler = () => {
        if (value?.length !== 4) {
            errorToast("please enter valid otp")
        } else {
            setLoading(true)
            var formdata = new FormData();
            formdata.append('email_phone', email || number);
            formdata.append('otp', "9999");
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(`${DOMAIN}otpVerify`, requestOptions)
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.status == "1") {
                        navigation.navigate("NewPassword", { showNumber, userId: res?.data?.id })
                    } else {
                        errorToast(res?.statusmsg, 3000)
                    }
                }).catch((err) => {
                    console.log("err", err)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <View style={{ flex: 1, padding: 20, }}>
                <Pressable onPress={() => navigation.goBack()} style={{ width: "100%", height: 60, }}>
                    <BackNav width={32} height={32} />
                </Pressable>
                <View style={{ width: "100%", justifyContent: "center" }}>
                    <MyText h3 bold style={{ color: "#000" }}>
                       {localizationStrings.Check_sms}
                    </MyText>
                    <MyText h5 regular style={{ color: "#9DB2BF", marginVertical: 5 }}>
                    {localizationStrings.please_details}
                    </MyText>
                </View>
                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <View
                            onLayout={getCellOnLayoutHandler(index)}
                            key={index}
                            style={[styles.cellRoot, isFocused && styles.focusCell]}>
                            <Text style={styles.cellText}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <MyButton loading={loading} onPress={otpHandler} textStyle={{ fontSize: 18, fontFamily: Theme.FONT_FAMILY_SEMIBOLD, lineHeight: 30, fontWeight: "800" }} style={{ borderRadius: 15, width: "95%", alignSelf: "center", margin: 5 }} title={localizationStrings.submit} />

        </View>
    )
}

export default Otp

const styles = StyleSheet.create({

    codeFieldRoot: {
        width: '70%',
        paddingVertical: 10,
        marginTop: 20
    },
    cellRoot: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#04CFA4"
    },
    cellText: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center',
    },
    focusCell: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 5,
        borderWidth: 1,
        borderColor: "#04CFA4"
    },
})