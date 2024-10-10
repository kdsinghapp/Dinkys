import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import HeaderTwo from './Header'
import { useNavigation } from '@react-navigation/native'
import MyStatusBar from '../elements/MyStatusBar'

export default function Help() {
    const navigation = useNavigation()
  return (
    <View style={{flex:1,backgroundColor:'#fff',}}>
          <MyStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} />
      <View style={styles.headerContainer}>
                    <HeaderTwo navigation={navigation} title={"Help"} />
                </View>

                <View style={{flex:1,padding:20}}>
                    <Text style={{color:'#000',fontSize:14}}>
                        Contact Us For any kind of queries related to Orders of service feel free to contact us on our official email address or phone number as given below:Dinkys-123654789 Email -support@dinkys.in
                    </Text>
                    <Text style={{color:'#000',fontSize:14,marginTop:10}}>Dinkys-123654789 
                    </Text>
                    <Text style={{color:'#000',fontSize:14}}>Email -support@dinkys.in
                    </Text>

                </View>
    </View>
  )
}

const styles = StyleSheet.create({

    headerContainer:{

    }
})