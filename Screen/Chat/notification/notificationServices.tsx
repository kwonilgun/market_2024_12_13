import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFcmToken } from './services';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status: authStatus', authStatus);
    getFcmToken();
  } else {
    console.error('getToken 진입 실패');
  }
}

// const getFcmToken = async () => {
//   try {
//     const fcmToken = await messaging().getToken();
//     console.log('fcm token:', fcmToken);
//     if (fcmToken && !isEmpty(fcmToken)) {
//       // Save the token
//       await AsyncStorage.setItem('fcmToken', fcmToken);
//     } else {
//       console.log('services: getFcmToken : firebase token이 없다.');
//     }
//   } catch (error) {
//     console.error('services : getFcmToken :  error =', error);
//   }
// };

export async function onDisplayNotification(
  item: FirebaseMessagingTypes.RemoteMessage,
) {
  // Request permissions (required for iOS)

  console.log('onDisplayNotification data ', item);

  // if (Platform.OS == 'ios') {
  //   await notifee.requestPermission();
  // }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: '1',
    name: '패키지',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  // if (item.notification) {
  //   await notifee.displayNotification({
  //     title: item.notification?.title!.toString(),
  //     body: item.notification?.body!.toString(),
  //     android: {
  //       channelId,
  //       color: 'red',
  //     },
  //   });
  // }
  if (item.data) {
    await notifee.displayNotification({
      title: item.data?.title.toString(),
      body: item.data?.body.toString(),
      android: {
        channelId,
        color: 'red',
      },
    });
  }
}

export async function notificationListeners() {


  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    if(Platform.OS === 'android'){
      console.log('android notificationListeners....');
      onDisplayNotification(remoteMessage);
    } else {
      console.log('ios notificationListeners....');
      onDisplayNotification(remoteMessage);
    }
  });


  messaging().onNotificationOpenedApp(async remoteMessage => {

    if (remoteMessage) {
      console.log(
        'onNotificationOpenedApp',
        remoteMessage.notification,
      );

      let badgeCount;
      badgeCount = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
      badgeCount = badgeCount + 1;
      await AsyncStorage.setItem('badgeCount', badgeCount.toString());

    }

  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        console.log(
          'getInitialNotification from quit state:',
          remoteMessage.notification,
        );

        let badgeCount;

          badgeCount = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
          badgeCount = badgeCount + 1;
          await AsyncStorage.setItem('badgeCount', badgeCount.toString());
          //  badgeCountDispatch({type: 'increment'});
      }
    });

  // return unsubscribe;
}
