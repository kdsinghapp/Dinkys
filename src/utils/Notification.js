import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import PushNotification from 'react-native-push-notification';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log("fcmToken", fcmToken)
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    let parsedMain = JSON.parse(remoteMessage?.data?.message);
    // showLocalNotification(parsedMain)
  });

  messaging().onMessage(async remoteMessage => {
    let parsedMain = JSON.parse(remoteMessage?.data?.message);
    // showLocalNotification(parsedMain)
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        let parsedMain = JSON.parse(remoteMessage?.data?.message);
        // showLocalNotification(parsedMain)
      }
    });
};

const showLocalNotification = () => {
  PushNotification.createChannel({
    channelId: "moz-channel",
    channelName: "My channel",
    channelDescription: "A channel to categorise your notifications",
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  });
};