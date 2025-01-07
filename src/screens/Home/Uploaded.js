/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator, Text } from 'react-native'
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
import HighlightAdsModal from './HighlightAdsModal'

const Uploaded = ({ navigation }) => {
    const userDetailData = useSelector((state) => state.user.user)
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState([]);
    const [ProductId, setProductId] = useState('');

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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const cityLevelOptions = [
        { duration: "1", price: "0.75" },
        { duration: "5", price: "1.25" },
        { duration: "15", price: "5" },
    ];

    const nationalLevelOptions = [
        { duration: "1", price: "1.25" },
        { duration: "5", price: "3" },
        { duration: "15", price: "7" },
    ];
    const handleOptionSelect = (level, duration, price) => {
        setSelectedOption({ level, duration, price });
        console.log(`Selected: ${level}, ${duration}, ${price}`);
    };


    console.log('product',product);
    
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo back={true} navigation={navigation} title={localizationStrings.own_product} />
            <MyButton title={localizationStrings.add_product} onPress={() => navigation.navigate("AddProduct")} style={{ borderRadius: 12, width: "95%", alignSelf: "center" }} />
            <ScrollView contentContainerStyle={{ backgroundColor: "#fff",  padding: 20 }}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                        :
                        product?.length == 0 ? null
                            :
                            <FlatList
                                data={product}
                                numColumns={2}
                                renderItem={({ item, index }) => (
                                    <View
                                        key={index} style={{
                                            width: "45%",
                                            borderRadius: 12,
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            shadowOffset: {
                                                height: 0,
                                                width: 0
                                            },
                                            margin: 10,
                                            backgroundColor: "#fff",
                                            elevation: 5,
                                            marginBottom: 15
                                        }}>

                                      
                                        <Pressable
                                            onPress={() => navigation.navigate("ProductDetails", { item })}
                                            style={{
                                                borderRadius: 12,
                                                backgroundColor: "#fff",
                                                height: 150,
                                                overflow: "hidden"
                                            }}>
                                            <Image source={{ uri: item?.product_images?.[0]?.image }} style={{
                                                width: "100%", height: "100%", borderTopLeftRadius: 12,
                                                borderTopRightRadius: 12,
                                            }} />
                                        </Pressable>
                                        <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                                            <Pressable style={{ padding: 5, position: "absolute", top: 10, right: 5, zIndex: 1 }} onPress={() => _deleteHandler(item?.id)}>
                                                <DeleteSvg width={20} height={20} />
                                            </Pressable>
                                            <Text style={{ color: "#04CFA4", fontSize: 14 }}>
                                                € {item?.price}
                                            </Text >
                                            <Text style={{ color: "#000", fontSize: 14 }}>
                                                {item?.brand}
                                            </Text >
                                            <Text style={{ color: "grey", fontSize: 12 }}>
                                                {item?.description?.substring(0, 30)}
                                            </Text >
                                          {item.is_highlight === 'TRUE' &&   <Text style={{ color: "grey", fontSize: 12 }}>
                                          {localizationStrings.highlight}:  {item?.days_highlight} Days
                                            </Text >}
                                        </View>
                                        {item.is_highlight !== 'TRUE' &&  <TouchableOpacity
                                            onPress={() => {
                                                console.log('item?.id', item?.id);


                                                setModalVisible(true)
                                                setProductId(item?.id)
                                            }}
                                            style={{
                                                height: 30,
                                                width: '80%',
                                                backgroundColor: '#04CFA4', alignItems: 'center',
                                                justifyContent: 'center', borderRadius: 5, marginVertical: 10, alignSelf: 'center'
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}> {localizationStrings.highlight}</Text>
                                        </TouchableOpacity>}

                               {item.is_highlight === 'TRUE' &&         <View style={{ position: 'absolute', top:5,right:5 }}>
                                            <Image source={require('../../assets/bookmark.png')} 
                                            
                                            style={{ height:30, width:30,tintColor:'#efbf04' }} />

                                            <Text style={{fontWeight:'800',fontSize:16,color:'#fdff32',position:'absolute',left:9,top:2}}>H</Text>
                                        </View>}
                                    </View>
                                )}
                            />
                    }
                </View>
                <HighlightAdsModal
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    cityLevelOptions={cityLevelOptions}
                    nationalLevelOptions={nationalLevelOptions}
                    onOptionSelect={handleOptionSelect}
                    ProductId={ProductId}
                />
            </ScrollView>

        </View>
    )
}

export default Uploaded