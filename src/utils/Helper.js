//import { dayjs } from './Dayjs'
//import moment from 'moment'
import Toast from 'react-native-toast-message';

export const ShowToast = (msg, type = 'success', otherProps = {}) =>
  Toast.show({text1: msg, type, ...otherProps});
export const isJson = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
export const errorHandle = err => {
  if (err.response) {
    if (err.response.status === 401) {
      return err.response.data;
    } else {
      return err.response.data;
    }
  } else if (err.message === 'Network Error') {
    return {status: 504, message: 'Network Error', data: []};
  } else if (typeof err.message === 'undefined') {
    return {status: 504, message: undefined, data: []};
  } else {
    return {status: 504, message: 'Other Error', data: []};
  }
};
export const validURL = str => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};
