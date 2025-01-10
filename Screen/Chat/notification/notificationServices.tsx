import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import isEmpty from '../../../utils/isEmpty';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    console.log('fcm token:', fcmToken);
    if (fcmToken && !isEmpty(fcmToken)) {
      // Save the token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    } else {
      console.log('services: getFcmToken : firebase token이 없다.');
    }
  } catch (error) {
    console.error('services : getFcmToken :  error =', error);
  }
};

export async function onDisplayNotification(
  item: FirebaseMessagingTypes.RemoteMessage,
) {
  // Request permissions (required for iOS)

  console.log('onDisplayNotification data ', item);

  if (Platform.OS == 'ios') {
    await notifee.requestPermission();
  }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: '1',
    name: '패키지',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: item.data?.title.toString(),
    body: item.data?.body.toString(),
    android: {
      channelId,
      color: 'red',
    },
  });
}

export async function notificationListeners() {
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    onDisplayNotification(remoteMessage);
  });

  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );

    // if (
    //   !!remoteMessage?.data &&
    //   remoteMessage?.data?.redirect_to === 'ProductDetail'
    // ) {
    //   setTimeout(() => {
    //     // NavigationService.navigate('ProductDetail', {
    //     //   data: remoteMessage?.data,
    //     // });
    //     console.log('onNotificationOpenedApp: ProductDetail');
    //   }, 1200);
    // }

    // if (
    //   !!remoteMessage?.data &&
    //   remoteMessage?.data?.redirect_to === 'Profile'
    // ) {
    //   setTimeout(() => {
    //     // NavigationService.navigate('Profile', {data: remoteMessage?.data});

    //     console.log('onNotificationOpenedApp: Profile');
    //   }, 1200);
    // }
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  // return unsubscribe;
}
