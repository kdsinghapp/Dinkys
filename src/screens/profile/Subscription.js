import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    TouchableOpacity,
    View,
    Text,
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
} from 'react-native';
import MyStatusBar from '../../elements/MyStatusBar';
import HeaderTwo from '../../components/Header';
import { hp, wp } from '../../utils/Constant';
import { useSelector } from 'react-redux';
import { DOMAIN } from '../../services/Config';
import { useIsFocused } from '@react-navigation/native';
import localizationStrings from '../Localization/Localization';

const Subscription = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const userDetailData = useSelector((state) => state.user.user);
const focus = useIsFocused()
    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await fetch(`https://panel.dkyss.es/api/plans?user_id=${userDetailData?.id}`, {
                    method: 'GET',
                    redirect: 'follow',
                });
                const result = await response.json();

                if (result.status == '1') {
                    setPlan(result.data);
                    setIsSubscribed(result.data?.subscription?.status === 'ACTIVE');
                } else {
                   // Alert.alert('Subscription', 'No Subscription Found.');
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
               // Alert.alert('Error', 'Something went wrong while fetching subscription details.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [focus]);

    const handleDeactivatePlan = async () => {
        const formdata = new FormData();
        formdata.append('user_id', userDetailData?.id);

        try {
            const response = await fetch('https://panel.dkyss.es/api/cancle_subs', {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            });
            const result = await response.json();

            if (result.status === '1') {
                setIsSubscribed(false);
                Alert.alert(`${localizationStrings.Subscription}`, 'Your subscription has been deactivated.');
            } else {
                Alert.alert('Error', 'Failed to deactivate subscription.');
            }
        } catch (error) {
            console.error('Error deactivating subscription:', error);
          //  Alert.alert('Error', 'Something went wrong while deactivating subscription.');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0BD89E" />
            </View>
        );
    }


    const payment_handler_web = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("email", userDetailData?.email);
        formdata.append("price", Number(1.50));
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}create-checkout-session`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res?.data?.url) {
                    navigation.navigate("WebViewScreen", {  url: res?.data?.url,subscription:true ,plan_id:1 })
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }


    return (
        <ImageBackground
            source={require('../../assets/Sub2.png')}
            style={{ flex: 1 }}
        >
            <MyStatusBar backgroundColor="transparent" barStyle="dark-content" />
            <HeaderTwo navigation={navigation} title={localizationStrings.Subscription} />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, color: '#0BD89E' }}>
                    {localizationStrings.manage_sub}
                </Text>
                <Text style={{ fontSize: 16, marginTop: 10, color: '#000', fontWeight: '600' }}>
                    {localizationStrings.current_status}: {isSubscribed ? 'Activated' : 'No Subscription'}
                </Text>
                {plan?.subscription && (
                    <Text style={{ fontSize: 16, marginTop: 5, color: '#000', fontWeight: '600' }}>
                       {localizationStrings.expire_on}: {plan.subscription.end_date}
                    </Text>
                )}
            </View>

            {isSubscribed ? (
                <TouchableOpacity
                    style={styles.deactivateButton}
                    onPress={()=>{
                     
                        Alert.alert(
                           `${localizationStrings.de_active}`,
                            `${localizationStrings.sub_can}`,
                            [
                                {
                                    text: `${localizationStrings.cancel}`,
                                    onPress: () => console.log('Deactivation canceled'),
                                    style: 'cancel', // Sets the button style to "Cancel"
                                },
                                {
                                    text: 'Cancel Subscription',
                                    onPress: handleDeactivatePlan, // Calls the function to deactivate the subscription
                                    style: 'destructive', // Optional: Makes the button visually distinct (iOS only)
                                },
                            ],
                            { cancelable: true } // Allows closing the alert by tapping outside (optional)
                        );
                    }}
                >
                    <Text style={styles.buttonText}>{localizationStrings.de_active}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.activateButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>{localizationStrings.Subscription}</Text>
                </TouchableOpacity>
            )}

            {/* Modal for Confirming Activation */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                           {localizationStrings.active_subsciption}
                        </Text>
                        <Text style={styles.modalText}>
                           {localizationStrings.active_sub_txt}
                        </Text>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                                setModalVisible(false);
                            payment_handler_web()
                            }}
                        >
                            <Text style={styles.confirmText}>{localizationStrings.confirm}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>{localizationStrings.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    activateButton: {
        backgroundColor: '#0BD89E',
        height: 55,
        bottom: 20,
        position: 'absolute',
        width: wp(80),
        alignSelf: 'center',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deactivateButton: {
        backgroundColor: '#FF6347',
        height: 55,
        bottom: 20,
        position: 'absolute',
        width: wp(80),
        alignSelf: 'center',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: wp(80),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    modalText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: '#0BD89E',
        paddingVertical: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    confirmText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#000',
    },
});

export default Subscription;
