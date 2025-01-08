import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderTwo from '../../components/Header';
import localizationStrings from '../Localization/Localization';
import Theme from '../../theme';
import { hp, wp } from '../../utils/Constant';

const PickupSeller = ({ driverId, modalVisible, setModalVisible }) => {
    const [sellerList, setSellerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [SelctedSeller, setSelctedSeller] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        if (modalVisible) {
            fetchSellers();
        }
    }, [modalVisible]);

    const fetchSellers = async () => {
        try {
            const formdata = new FormData();
            formdata.append('driver_id', driverId); // Use dynamic driver ID

            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            const response = await fetch(
                'https://panel.dkyss.es/api/get-professional-sellers',
                requestOptions
            );
            const result = await response.json();
            if (result.status === 1) {
                setSellerList(result.data);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    const addSeller = async (sellerId) => {
        try {
            const formdata = new FormData();
            formdata.append('driver_id', driverId); // Use dynamic driver ID
            formdata.append('professional_seller_id', sellerId);

            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            const response = await fetch(
                'https://panel.dkyss.es/api/add-professional-sellers-connect',
                requestOptions
            );
            const result = await response.json();
            if (result.status == 1) {
                console.log('Seller added successfully:', result.message);
                setModalVisible(false); // Close the modal
            } else {
                console.error('Error adding seller:', result.message);
            }
        } catch (error) {
            console.error('Error adding seller:', error);
        }
    };

    const handleConfirmLocation = (seller) => {
        console.log('Selected Seller:', seller);
        setSelctedSeller(seller.driver_id)

    };

    const renderSeller = ({ item }) => (
        <TouchableOpacity
            style={[styles.sellerContainer,SelctedSeller == item.driver_id && {borderWidth:3,borderColor:'green'}]}
            onPress={() => handleConfirmLocation(item)}
        >
            <Image
                source={{
                    uri: `https://panel.dkyss.es/uploads/${item.driver_images}`,
                }}
                style={styles.sellerImage}
            />
            <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>
                    {item.driver_first_name} {item.driver_last_name}
                </Text>
                <Text style={styles.sellerCompany}>{item.driver_company_name}</Text>
                <Text style={styles.sellerCity}>{item.driver_address_1}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <HeaderTwo navigation={navigation} title={'Sellers'} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={Theme.BUTTON_PRIMARY_COLOR} />
                ) : (
                    <FlatList
                        data={sellerList}
                        renderItem={renderSeller}
                        keyExtractor={(item) => item.driver_id.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                )}

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                        addSeller(SelctedSeller);

                    }}
                >
                    <Text style={styles.closeButtonText}>Add Seller</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default PickupSeller;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerContainer: {
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 10,
        elevation: 2,
        height: hp(15),
        width: wp(90)

    },
    sellerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#fff'
    },
    sellerDetails: {
        flex: 1,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    sellerCompany: {
        fontSize: 14,
        color: 'gray',
    },
    sellerCity: {
        fontSize: 12,
        color: 'darkgray',
    },
    listContainer: {
        paddingBottom: 80,
    },
    closeButton: {
        backgroundColor: Theme.BUTTON_PRIMARY_COLOR,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
