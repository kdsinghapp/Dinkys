import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import HeaderTwo from './Header'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MyStatusBar from '../elements/MyStatusBar'
import { useSelector } from 'react-redux'

export default function Help() {
    const navigation = useNavigation()

    const [helpData, sethelpData] = useState([])
    const userDetailData = useSelector((state) => state.user.user)

    const token = userDetailData?.access_token
    useFocusEffect(
        React.useCallback(() => {
            _get_about()
        }, [])
    )
    const _get_about = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://api.dkyss.es/api/get_help", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const res = JSON.parse(result)
                if (res?.status == '1') {
                    sethelpData(res?.data)

                }

            })

            .catch((error) => console.error(error));
    }




  return (
    <View style={{flex:1,backgroundColor:'#fff',}}>
          <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
      <View style={styles.headerContainer}>
                    <HeaderTwo navigation={navigation} title={"Help"} />
                </View>

                <View style={{flex:1,padding:20}}>
                    <Text style={{color:'#000',fontSize:14}}>
                       {helpData?.description}
                    </Text>
                    <Text style={{color:'#000',fontSize:14,marginTop:10}}>Dinkys-  {helpData?.number}
                    </Text>
                    <Text style={{color:'#000',fontSize:14}}>Email -  {helpData?.email}
                    </Text>

                </View>
    </View>
  )
}

const styles = StyleSheet.create({

    headerContainer:{

    }
})