import React, { memo } from 'react'
import { View } from 'react-native'

function MyRadio({ status, size, style, checkedColor, uncheckedColor }) {
    size = size || 20
    uncheckedColor = uncheckedColor || '#CCC'
    checkedColor = checkedColor || '#CCC'
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: status ? checkedColor : uncheckedColor,
                marginRight: 10,
                ...style
            }}>
            <View
                style={{
                    width: size - 10,
                    height: size - 10,
                    borderRadius: size - 10,
                    backgroundColor: status ? checkedColor : 'transparent'
                }}
            />
        </View>
    )
}
export default memo(MyRadio)
