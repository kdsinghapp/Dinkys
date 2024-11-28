import React from 'react';
import Navigation from './src/navigation/Index';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import store, { persistor } from './src/redux/store';
import toastConfig from './src/utils/customToast';
import { notificationListener, requestUserPermission } from './src/utils/Notification';
import messaging from '@react-native-firebase/messaging';
import { LogBox } from 'react-native';
import { LanguageProvider } from './src/screens/Localization/LanguageContext';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
const App = () => {

  React.useEffect(() => {
    notificationListener();
    requestUserPermission();
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("remoteMessage",remoteMessage)
      // let parsedMain = JSON.parse(remoteMessage?.data?.message);
      // showLocalNotification(parsedMain)
    });
    return unsubscribe;
  }, []);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <LanguageProvider>
        <Navigation />
        <Toast config={toastConfig} />
   </LanguageProvider>
      </PersistGate>
    </Provider>
  );
};

export default App; 