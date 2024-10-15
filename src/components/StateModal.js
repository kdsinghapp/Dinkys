import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, FlatList, ActivityIndicator, Pressable } from 'react-native';

import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../elements/Text';
import { hp, wp } from '../utils/Constant';
import Theme from '../theme';
import MyText from '../elements/MyText';

const StateModal = ({
    isVisible = false,
    onBackdropPress = () => { },
    onDone = () => { },
    data,
    loading,
    state
}) => {
    const insets = useSafeAreaInsets();
    const [specialtyData, setSpecialtyData] = useState({})
    const [searchVal, setSearchVal] = useState('');
    const [filterData, setFilterData] = useState(data);

    const searchHandler = value => {
        if (value) {
            const newData = data.filter(item => {
                const itemData = item?.name
                    ? item?.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterData(newData);
            setSearchVal(value);
        } else {
            setFilterData(data);
            setSearchVal(value);
        }
    };

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
                            Select {state ? "State" : "Country"}
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: wp(4),
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                        <View style={{ width: "100", flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 15 }}>
                            <TextInput
                            
                            placeholderTextColor={'#000'}

                            value={searchVal} onChangeText={(e) => searchHandler(e)} 
                            placeholder={state ? "Search State..." : "Search Country"} style={{color:'#000', width: "100%", padding: 15, borderWidth: 1, borderColor: "#F5F5F5", borderRadius: 12 }} />
                        </View>
                        {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size={"small"} />
                        </View>
                            :
                            <>
                                {data?.length === 0 ?
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <MyText h5 bold >No {state ? "State" : "Country"}  </MyText>
                                    </View>
                                    :
                                    <FlatList
                                        data={searchVal.length === 0 ? data : filterData}
                                        showsVerticalScrollIndicator={false}
                                        style={{ flex: 1, marginTop: 5, paddingHorizontal: 15 }}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => {
                                            return (
                                                <Pressable
                                                    onPress={() => setSpecialtyData(item)}
                                                    style={{ width: "100%", alignSelf: "center", flexDirection: "row", borderRadius: 20, marginBottom: 25, alignItems: "center" }}>
                                                    <View style={{ width: 22, height: 22, backgroundColor: item.id == specialtyData.id ? Theme.BUTTON_PRIMARY_COLOR : "#fff", borderRadius: 5, borderWidth: 1, overflow: "hidden", borderColor: "gray" }} />
                                                    <View style={{ marginLeft: 10, justifyContent: "center", width: "75%" }}>
                                                        <MyText h6 regular style={{ color: "#000" }}>
                                                            {item?.name}
                                                        </MyText>
                                                    </View>
                                                </Pressable>
                                            )
                                        }}
                                    />
                                }
                            </>
                        }
                        <Button
                            buttonTitle={"Continue"}
                            onPress={() => { onDone(specialtyData), setSearchVal("") }}
                            disabled={loading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default StateModal;

const styles = StyleSheet.create({
    modalChildContainer: {
        backgroundColor: '#FFF',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp(70),
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