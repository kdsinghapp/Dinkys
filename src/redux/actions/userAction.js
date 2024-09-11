import AsyncStorage from '@react-native-async-storage/async-storage';
import { SET_USER, TOKEN } from './userType';
export const setUser = () => {
  return dispatch => {
    AsyncStorage.getItem('@USER').then(response =>
      dispatch({ type: SET_USER, payload: JSON.parse(response) || {} }),
    );
  };
};
export const setToken = token => {
  return dispatch => {
    dispatch({ type: TOKEN, payload: token });
  };
};
