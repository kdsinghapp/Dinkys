/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import Bag from "../../assets/svg/bag.svg"
import SearchSvg from "../../assets/svg/search.svg"
import DeleteSvg from "../../assets/svg/delete.svg"
import { useFocusEffect } from '@react-navigation/native'
import { errorToast } from '../../utils/customToast'
import { DOMAIN } from '../../services/Config'
import HeaderTwo from '../../components/Header'
import MyButton from '../../elements/MyButton'
import { useSelector } from 'react-redux'
import localizationStrings from '../Localization/Localization'

const Uploaded = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            _get_product()
        }, [])
    )

    const _get_product = () => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("user_id", userDetailData?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get-products-by-user-id`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setProduct(res?.products)
                } else {
                    setProduct([])
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    const _deleteHandler = (id) => {
        Alert.alert('Delete Item', 'Are you sure you want to delete this item', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteItem(id) },
        ]);
    }

    const deleteItem = (value) => {
        setLoading(true)
        var formdata = new FormData();
        formdata.append("product_id", value);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}delete-product`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    _get_product()
                }
            }).catch((err) => {
                console.log("err", err)
            }).finally(() => {
                setLoading(false)
            })
    }


    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo back={true} navigation={navigation} title={localizationStrings.own_product} />
            <MyButton title={localizationStrings.add_product} onPress={() => navigation.navigate("AddProduct")} style={{ borderRadius: 12, width: "95%", alignSelf: "center" }} />
            <ScrollView contentContainerStyle={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                        :
                        product?.length == 0 ? null
                            :
                            product.map((item, index) => {
                                return (
                                    <View
                                        key={index} style={{
                                            width: "48%",
                                            borderRadius: 12,
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            shadowOffset: {
                                                height: 0,
                                                width: 0
                                            },
                                            backgroundColor: "#fff",
                                            elevation: 5,
                                            marginBottom: 15
                                        }}>
                                        <Pressable
                                            onPress={() => navigation.navigate("ProductDetails", { item })}
                                            style={{
                                                borderRadius: 12,
                                                backgroundColor: "#fff",
                                                height: 172,
                                                overflow: "hidden"
                                            }}>
                                            <Image source={{ uri: item?.product_images?.[0]?.image }} style={{
                                                width: "100%", height: "100%", borderTopLeftRadius: 12,
                                                borderTopRightRadius: 12,
                                            }} />
                                        </Pressable>
                                        <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                                            <Pressable style={{ padding: 5, position: "absolute", top: 10, right: 5, zIndex: 1 }} onPress={() => _deleteHandler(item?.id)}>
                                                <DeleteSvg width={25} height={25} />
                                            </Pressable>
                                            <MyText h6 bold style={{ color: "#04CFA4" }}>
                                                € {item?.price}
                                            </MyText >
                                            <MyText h6 semibold style={{ color: "#000" }}>
                                                {item?.brand}
                                            </MyText >
                                            <MyText h6 regular style={{ color: "#949494" }}>
                                                {item?.description}
                                            </MyText >
                                        </View>
                                    </View>

                                )
                            })}
                </View>
            </ScrollView>

        </View>
    )
}

export default Uploaded