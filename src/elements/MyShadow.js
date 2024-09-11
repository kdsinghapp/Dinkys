import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

const MyShadow = ({ children, style }) => {
    return <View style={[styles.customShadow, style]}>{children}</View>
}
const styles = StyleSheet.create({
    customShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.84,
        elevation: 2,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    }
})
export default memo(MyShadow)
