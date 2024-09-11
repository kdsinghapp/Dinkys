import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Toast from 'react-native-toast-message';
import Text from '../elements/Text';
import Size from '../elements/Text';

const toastConfig = {
  successResponse: ({text1}) => (
    <View style={styles.container}>
      <Text
        style={styles.titleStyle}
        size={Size.XXSmall}
        color={'#000'}
        fontWeight="600">
        {text1}
      </Text>
    </View>
  ),
  errorResponse: ({text1}) => (
    <View style={styles.errorContainer}>
      <Text
        fontWeight="600"
        style={styles.titleStyle}
        size={Size.XXSmall}
        color={'#000'}>
        {text1}
      </Text>
    </View>
  ),
  normalResponse: ({text1}) => (
    <View style={styles.normalContainer}>
      <Text
        fontWeight="600"
        style={styles.titleStyle}
        size={Size.XXSmall}
        color={'#000'}>
        {text1}
      </Text>
    </View>
  ),
};

export const successToast = (message, time = 2000) => {
  Toast.show({
    type: 'successResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 50,
  });
};

export const errorToast = (message, time = 2000) => {
  Toast.show({
    type: 'errorResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 50,
  });
};
export const normalToast = (message, time = 2000) => {
  Toast.show({
    type: 'normalResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 50,
  });
};

export default toastConfig;

const styles = StyleSheet.create({
  titleStyle: {
    marginLeft: 15,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  errorIconStyle: {
    width: 17,
    height: 17,
  },
  errorContainer: {
    height: 55,
    width: '93%',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderLeftWidth: 10,
    borderLeftColor: '#FF3131',
    shadowColor: 'gray',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  container: {
    height: 55,
    width: '93%',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderLeftWidth: 10,
    borderLeftColor: '#51B732',
    shadowColor: '#51B732',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  normalContainer: {
    height: 55,
    width: '93%',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderLeftWidth: 10,
    borderLeftColor: '#4D3DB5',
    shadowColor: 'gray',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
