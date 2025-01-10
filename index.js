import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {onDisplayNotification} from './Screen/Chat/notification/notificationServices';

if (Platform.OS === 'android') {
  const messaging = require('@react-native-firebase/messaging').default;
  const notifee = require('@notifee/react-native').default;
  const {EventType} = require('@notifee/react-native').default;
  console.log('index.js: messaging 초기화');

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    onDisplayNotification(remoteMessage);
  });

  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;

    console.log('index, onBackgroudEvent, type = ', type);
    // console.log('detail', detail);
  });
}

AppRegistry.registerComponent(appName, () => App);
