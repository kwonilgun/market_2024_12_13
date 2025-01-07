/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import {
  displayNotification,
  initializeNotificationChannel,
} from './Screen/Chat/notification/displayNotification';

// initializeNotificationChannel();
// Handle foreground messageså
// unsubscribeForegroundMessage = messaging().onMessage(async remoteMessage => {
//   console.log('Foreground FCM Message:', remoteMessage);
//   // Handle the notification in the foreground
//   //   await initializeNotificationChannel();
//   await displayNotification(remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
