/* eslint-disable prettier/prettier */
import React, { memo } from 'react'
import { Text } from 'react-native'
import Theme from '../theme/index'

const MyText = ({
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
    p,
    bold,
    semibold,
    medium,
    italic,
    children,
    style,
    numberOfline,
    ...rest
}) => {
    return (
        <Text
            numberOfLines={numberOfline}
            style={[
                {
                    fontSize: Theme.FONT_SIZE_EXTRA_SMALL,
                    fontFamily: Theme.FONT_FAMILY_REGULAR,
                    color: Theme.TEXT_COLOR_PRIMARY
                },
                h1 && { fontSize: Theme.FONT_SIZE_EXTRA_EXTRA_LARGE },
                h2 && { fontSize: Theme.FONT_SIZE_LARGE },
                h7 && { fontSize: Theme.FONT_SIZE_EXTRA_LARGE },
                h3 && { fontSize: Theme.FONT_SIZE_SEMI_MEDIUM },
                h4 && { fontSize: Theme.FONT_SIZE_MEDIUM },
                h5 && { fontSize: Theme.FONT_SIZE_SMALL },
                h6 && { fontSize: Theme.FONT_SIZE_EXTRA_SMALL },
                p && { fontSize: Theme.FONT_SIZE_EXTRA_EXTRA_SMALL },
                bold && { fontFamily: Theme.FONT_FAMILY_BOLD },
                semibold && { fontFamily: Theme.FONT_FAMILY_SEMIBOLD },
                medium && { fontFamily: Theme.FONT_FAMILY_MEDIUM },
                style
            ]}
            {...rest}>
            {children}
        </Text>
    )
}
export default memo(MyText)
