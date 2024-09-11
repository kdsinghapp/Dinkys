/* import {createStore} from 'redux';
import rootReducer from './reducer/rootReducer';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import rootReducer from "./reducer/rootReducer";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer);
// let store = createStore(rootReducer);

export let persistor = persistStore(store);
export default store;
