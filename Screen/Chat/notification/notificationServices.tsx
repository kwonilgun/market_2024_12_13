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


export async function onDisplayNotification(
  item: FirebaseMessagingTypes.RemoteMessage,
) {

  // console.log('onDisplayNotification data ', item);

  if(item?.data?.body){
    const bodyString = item.data.body;
    console.log('notificationServices - messageData', bodyString);

    let messageData;

    if (typeof bodyString === 'string') {
        // bodyString이 문자열이면 JSON 파싱
        messageData = JSON.parse(bodyString);
    } else {
        // bodyString이 이미 객체면 그대로 사용
        messageData = bodyString;
    }

    // 2025-03-04 13:45:51, messageData = {name:'kwonilgun', text:'hello'}로 구성이 되어 있다.
    console.log('notificationServives - name', messageData.name);
    await AsyncStorage.setItem('chatFromWho', messageData.name);

    // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: '1',
    name: '패키지',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  if (item.data) {
    await notifee.displayNotification({
      title: item.data?.title.toString(),
      body: messageData.text,
      android: {
        channelId,
        color: 'red',
      },
    });
  }


  }
}




export async function onIosDisplayNotification(
  item: FirebaseMessagingTypes.RemoteMessage,
) {

  console.log('onIosDisplayNotification data ', item);

  if(item.data){
    const dataString = item.data;
    console.log('onIosDisplayNotification - messageData', dataString);

    let messageData;

    if (typeof dataString === 'string') {
        // bodyString이 문자열이면 JSON 파싱
        messageData = JSON.parse(dataString);
    } else {
        // bodyString이 이미 객체면 그대로 사용
        messageData = dataString;
    }

    // 2025-03-04 13:45:51, messageData = {name:'kwonilgun', text:'hello'}로 구성이 되어 있다.
    console.log('onIosDisplayNotification - name', messageData.name);
    await AsyncStorage.setItem('chatFromWho', messageData.name);


    const title = item.notification?.title;
    const contents = item.notification?.body;
    console.log('notificationServices - ios - title ', title);

    await notifee.displayNotification({
        title: title,
        body: contents,
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
      onIosDisplayNotification(remoteMessage);
    }
  });


  // messaging().onNotificationOpenedApp(async remoteMessage => {

  //   console.log('messaging().onNotification....>>>>');
  //   if (remoteMessage) {
  //     console.log(
  //       'onNotificationOpenedApp',
  //       remoteMessage.notification,
  //     );

  //     let badgeCount;
  //     badgeCount = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
  //     badgeCount = badgeCount + 1;
  //     await AsyncStorage.setItem('badgeCount', badgeCount.toString());

  //   }

  // });

  // Check whether an initial notification is available
  // messaging()
  //   .getInitialNotification()
  //   .then(async remoteMessage => {
  //     if (remoteMessage) {
  //       console.log(
  //         'getInitialNotification from quit state:',
  //         remoteMessage.notification,
  //       );

  //       let badgeCount;

  //         badgeCount = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
  //         badgeCount = badgeCount + 1;
  //         await AsyncStorage.setItem('badgeCount', badgeCount.toString());
  //         //  badgeCountDispatch({type: 'increment'});
  //     }
  //   });

  // return unsubscribe;
}
