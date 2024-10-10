import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList, ActivityIndicator, Pressable, Text, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../utils/Constant';
import Theme from '../theme';
import MyText from '../elements/MyText';
import { useFocusEffect } from '@react-navigation/native';
import { DOMAIN } from '../services/Config';
import { successToast } from '../utils/customToast';

const OrderDetails = ({
    isVisible = false,
    onBackdropPress = () => { },
    onDone = () => { },
    data,
    type,
    productData
}) => {
    const insets = useSafeAreaInsets();
    const [information, setInformation] = useState("")
    const [loading, setLoading] = useState(false)
    const [msgBycustomer, setmsgBycustomer] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            if (data) {
                _get_order_details()
            }
        }, [data])
    )


    const _get_order_details = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("order_id", data);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_order_detail`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    setInformation(res?.result)
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }



    const _changeOrderStatusByUser = async (status) => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("order_id", data);
        formdata.append("status", status);
        formdata.append("msg_by_customer", msgBycustomer);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        await fetch(`${DOMAIN}changeOrderStatusByUser`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.status == "1") {
                    if(status == 'Not Received'){
                        successToast("Your Complaint Sent to Seller Successfully")
                        setModalVisible(false)
                        onBackdropPress()
                        setmsgBycustomer('')
                     
                    }
                    else if(status == 'Received'){
                        successToast("Thank You for Confirmation")
                        setModalVisible(false)
                        onBackdropPress()
                       
                    }
                }
            }).catch((err) => {
                console.log("err", err)
                setModalVisible(false)
                onBackdropPress()
            }).finally(() => {
                setLoading(false)
                onBackdropPress()
                setModalVisible(false)
            })
    }
    const _onSubmit = () => {
        onDone()
    }

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
                <MyText h5 style={{ color: "#fff" }}>
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
            style={{ padding: 0, margin: 0, zIndex: 2 }}
            >
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
                    <Text h3 bold style={{ alignSelf: "center", marginTop: 15, fontWeight: '600', fontSize: 18, color: '#000' }} >Order Details</Text>

                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                        <View style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden" }}>
                            <Image source={{ uri: information?.product_data?.product_images?.[0].image }} style={{ width: "100%", height: "100%" }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                {information?.product_data?.title}
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                Colour: Made Blue
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/Total3x.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                {"Total"}
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                $ {information?.total_amount}
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/User.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                {"Sold by"}
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                {productData?.user_name}
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/AddressShiping3x.png')} style={{ width: 40, height: 40 }} />
                        </View>
                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                Shipping address
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                {information?.product_data?.product_location}
                            </MyText >

                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: "#D9D9D9", paddingVertical: 18 }}>
                        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/dinkyimg/Paymentmethod3x.png')} style={{ width: 40, height: 40 }} />
                        </View>

                        <View >
                            <MyText h5 bold style={{ color: "#1C1B1B" }}>
                                Payment status
                            </MyText >
                            <MyText h6 regular style={{ color: "#000" }}>
                                {information?.payment_status}
                            </MyText >
                        </View>
                    </View>
                    {type !== "Complete" ?
                        <Button
                            buttonTitle={"Go Back"}
                            onPress={onBackdropPress}
                            disabled={loading}
                        />
                        : <>
                           {information?.user_conformation_status == 'Pending' &&<>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#000', marginTop: 30 }}>Order Confirmation
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', }}>Have you received your order?
                            </Text>

                
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                <TouchableOpacity 
                                onPress={()=>{
                                    setModalVisible(true)
                                }}
                                style={{
                                    width: '45%',
                                    backgroundColor: '#0BD89E', marginHorizontal: 10,
                                    paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: '600' }}>Not Received</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setmsgBycustomer('Order Received')
                                        _changeOrderStatusByUser('Received')
                                    }}
                                    style={{
                                        width: '45%',
                                        backgroundColor: '#0BD89E', marginHorizontal: 10,
                                        paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
                                    }}>
                                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: '600' }}>Order Received</Text>
                                </TouchableOpacity>

                                   
                                           </View>
             </>                        
}
</>                                
                       
                    }
                      {/* Modal for entering complaint */}
                  
                </View>
             
            </View>
            <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => setModalVisible(false)}  // Close modal when back button is pressed on Android
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalTitle}>Order Not Received</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Enter your complaint"
                                                value={msgBycustomer}
                                                onChangeText={(txt)=>setmsgBycustomer(txt)}
                                                multiline={true}
                                            />
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity
                                                    style={styles.submitButton}
                                                    onPress={() => {
                                                        _changeOrderStatusByUser('Not Received')
                                                    }}  // Submit the complaint
                                                >
                                                    <Text style={styles.buttonText}>Submit Complaint</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.cancelButton}
                                                    onPress={() => setModalVisible(false)}  // Close modal without submitting
                                                >
                                                    <Text style={styles.buttonText}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>  
        </Modal>
    );
};

export default OrderDetails;

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
     modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Darken background when modal is open
      },
      modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
       
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
        color:'#000'
      },
      textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        color:'#000'
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      submitButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      cancelButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
});