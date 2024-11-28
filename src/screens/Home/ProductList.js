
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert,Text, View, FlatList, TouchableOpacity, TextInput, BackHandler, ActivityIndicator, Dimensions } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import { useFocusEffect } from '@react-navigation/native'
import { DOMAIN } from '../../services/Config'
import HeaderTwo from '../../components/Header'
import Heart from "../../assets/svg/Heart2.svg"
import localizationStrings from '../Localization/Localization'
const ProductList = ({ navigation, route }) => {
    const { item } = route?.params
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
        formdata.append("category_id", item?.id);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(`${DOMAIN}get_products`, requestOptions)
            .then((response) => response.json())
            .then(async (res) => {
                if (res.status == "1") {
                    setProduct(res?.category)
                } else {
                    setProduct([])
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
            <HeaderTwo navigation={navigation} title={localizationStrings.product_list} />
            <ScrollView style={{ backgroundColor: "#fff", flex: 1, padding: 20, paddingTop: 5 }}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    {loading ? <View style={{ height: Dimensions.get("screen").height / 2, width: Dimensions.get("screen").width * 0.9, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={"small"} />
                    </View>
                        :
                        product?.length == 0 ? <View style={{ height: Dimensions.get("screen").height / 2, width: Dimensions.get("screen").width * 0.9, justifyContent: "center", alignItems: "center" }}>
                            <MyText h5 bold style={{ color: "#000" }}>
                         {localizationStrings.no_data_here}
                            </MyText >
                        </View>
                            :
                           
                           
                        <FlatList  
                        numColumns={2}
                        data={product}
                        renderItem={({item,index})=>(
                            <Pressable
                            onPress={() => navigation.navigate("ProductDetails", { item })}
                            key={index} style={{
                                width: "46%",
                                borderRadius: 12,
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                shadowOffset: {
                                    height: 0,
                                    width: 0
                                },
                                backgroundColor: "#fff",
                                elevation: 5,
                                margin: 5,
                                marginBottom: 15
                            }}>
                            <View style={{
                                borderRadius: 12,
                                backgroundColor: "#fff",
                                height:150,
                                overflow: "hidden"
                            }}>
                                <Image source={{ uri: item?.product_images?.[0]?.image }} style={{
                                    width: "100%", height: "100%", borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                }} />
                            </View>
                            <View style={{ justifyContent: "center", margin: 5, backgroundColor: "#fff", padding: 8 }}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>

                                <Text style={{ color: "#04CFA4", fontSize: 14, fontWeight: '700' }}>
                                    € {item?.price}
                                </Text >
                                <Heart />
                            </View>
                                <Text style={{ color: "#000",fontWeight:'600',fontSize:12 }}>
                                    {item?.title?.substring(0,20)}
                                </Text >
                                <Text style={{ color: "#949494",fontWeight:'600',fontSize:12 }}>
                                    {item?.description?.substring(0,25)}
                                </Text >
                            </View>
                        </Pressable>
                        )}
                        />
                           }
                </View>
            </ScrollView>

        </View>
    )
}

export default ProductList