import React, { memo, useEffect } from 'react'
import { Platform, StatusBar, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
const height = getStatusBarHeight()
const MyStatusBar = ({ backgroundColor, barStyle,opacity }) => {
    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBarStyle(barStyle || 'dark-content', true)
            StatusBar.setBackgroundColor(backgroundColor || '#f7f7f7')
        }
    }, [])
    return (
        <View style={{ height: height, backgroundColor: backgroundColor , opacity:opacity }}>
            <StatusBar
                translucent={true}
                animated={true}
                backgroundColor={backgroundColor || '#f7f7f7'}
                barStyle={barStyle || 'dark-content'}
            />
        </View>
    )
}
export default memo(MyStatusBar)
