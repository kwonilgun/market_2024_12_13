/**
 * @ Author: Kwonilgun
 * @ Create Time: 2025-01-14 16:42:49
 * @ Modified by: Your name
 * @ Modified time: 2025-01-15 14:25:10
 * @ Description:
 */



import {AppRegistry, Platform, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {onDisplayNotification} from './Screen/Chat/notification/notificationServices';
import firebase from '@react-native-firebase/app';



if (Platform.OS === 'android') {
  const messaging = require('@react-native-firebase/messaging').default;
  const notifee = require('@notifee/react-native').default;
  const {EventType} = require('@notifee/react-native');
  console.log('index.js: messaging 초기화');

  let badgeCount = 0; // 뱃지 카운트 초기화

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    await onDisplayNotification(remoteMessage);
  });

  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;

    console.log('index, onBackgroudEvent, type = ', type);
    // console.log('detail', detail);
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.PRESS) {
      // Update external API
      console.log('onBackgroundEvent pressed....');

      // // Remove the notification
      await notifee.cancelNotification(notification.id);
      // 앱을 특정 탭으로 열기
      badgeCount++;
      await notifee.setBadgeCount(badgeCount);

      Linking.openURL('myapp://UserMain'); // 'chat'은 특정 탭의 딥 링크
    }
  });
}

AppRegistry.registerComponent(appName, () => App);
