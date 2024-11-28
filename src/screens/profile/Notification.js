import React, { memo, useState } from "react";
import { Pressable, View, Text, ActivityIndicator } from "react-native";
import MyStatusBar from "../../elements/MyStatusBar";
import HeaderTwo from "../../components/Header";
import NotiOn from "../../assets/svg/Toggle.svg"
import NotiOff from "../../assets/svg/Toggle_back.svg"
import { _get_profile, _update_notiification } from "../../services/Auth";
import { useDispatch, useSelector } from "react-redux";
import localizationStrings from "../Localization/Localization";

const Notification = ({ navigation, route }) => {
    const userData = useSelector((state) => state?.user)
    const dispatch = useDispatch()

    const Row = memo(({ label, value, onChange }) => {

        return (
            <View style={{ padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Text
                    style={{
                        color: "#1D3A70",
                        fontSize: 18,
                        fontWeight: '600',
                    }}>
                    {label}
                </Text>
                {value == true ?
                    <Pressable onPress={() => onChange(false)}>
                        <NotiOn width={44} height={24} />
                    </Pressable>
                    :
                    <Pressable onPress={() => onChange(true)}>
                        <NotiOff width={44} height={24} />
                    </Pressable>
                }
            </View>
        );
    });

    const _onChange = async (type, value) => {
        if (type == 'general') {
            dispatch({ type: "GENERAL", payload: value ? true : false });
        } else if (type == 'sound') {
            dispatch({ type: "SOUND", payload: value ? true : false });
        } else if (type == 'vibrate') {
            dispatch({ type: "VIBRATE", payload: value ? true : false });
        } else if (type == 'app_update') {
            dispatch({ type: "APPUPDATE", payload: value ? true : false });
        } else {
            dispatch({ type: "NEWTIP", payload: value ? true : false });
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={localizationStrings.notification} />
            <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>

                <Row
                    label={localizationStrings.general_notification}
                    value={userData?.general}
                    onChange={value => _onChange('general', value)}
                />
                <Row
                     label={localizationStrings.sound}
                    value={userData?.sound}
                    onChange={value => _onChange('sound', value)}
                />
                <Row
                    label={localizationStrings.Vibrate}
                    value={userData?.vibrate}
                    onChange={value => _onChange('vibrate', value)}
                />
                <Row
                   label={localizationStrings.app_updates}
                    value={userData?.appupdate}
                    onChange={value => _onChange('app_update', value)}
                />
                <Row
                     label={localizationStrings.tips_avail}
                    value={userData?.newTip}
                    onChange={value => _onChange('tips_available', value)}
                />
            </View>
        </View>
    )

}
export default Notification