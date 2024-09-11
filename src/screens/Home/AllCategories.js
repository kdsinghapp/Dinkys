
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Alert, View, FlatList, TouchableOpacity, TextInput, Text } from 'react-native'
import MyText from '../../elements/MyText'
import MyStatusBar from '../../elements/MyStatusBar'
import HeaderTwo from '../../components/Header'

const AllCategories = ({ navigation, route }) => {
    const { categories } = route?.params
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
            <HeaderTwo navigation={navigation} title={"Categories"} />
            <ScrollView style={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        alignItems: 'center',
                        width: "100%",
                        backgroundColor: "#fff",
                        flexWrap: "wrap",
                    }}>
                    {categories?.length == 0 ? null
                        :
                        categories?.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("ProductList", { item })}
                                    key={index}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: "25%",
                                    }}>
                                    <Image source={{ uri: item?.image }} style={{ width: 30, height: 30 }} resizeMode='contain' />
                                    <Text regular style={{ color: "#000", textAlign: "center", fontSize: 12, fontWeight: '600', height: 40,marginTop:8 }} >{item?.category_name?.substring(0,20)}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

            </ScrollView>

        </View>
    )
}

export default AllCategories