/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Theme from '../theme/index';

const MyLoader = ({fullscreen, isshow, style, size = 'large'}) => {
  if (isshow === false) return null;
  if (fullscreen) {
    return (
      <View
        style={{
          backgroundColor: 'rgba(255,255,255, 0.5)',
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          justifyContent: 'center',
          alignItem: 'center',
          ...style,
        }}>
        <ActivityIndicator size={size} color={Theme.BUTTON_PRIMARY_COLOR} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={Theme.BUTTON_PRIMARY_COLOR} />;
};

export default memo(MyLoader);
