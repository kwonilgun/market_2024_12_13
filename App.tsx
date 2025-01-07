/* eslint-disable prettier/prettier */
/*
 * File: App.tsx
 * Project: root_project
 * File Created: Wednesday, 14th February 2024
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright : 루트원 AI
 */

import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {AuthProvider} from './context/store/Context.Manager';
import MainTab from './Navigator/MainTab';
import store from './Redux/Cart/Store/store';
import {Alert, LogBox, PermissionsAndroid, Platform} from 'react-native';

import messaging from '@react-native-firebase/messaging';

// import StartNotify from './Screen/Notification/StartNotify';
// import SplashScreen from 'react-native-splash-screen';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import Badge from 'react-native-app-badge';
import strings from './constants/lang';
import {
  LanguageContext,
  LanguageProvider,
} from './context/store/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StartNotify from './StartNotify';
import {
  displayNotification,
  initializeNotificationChannel,
} from './Screen/Chat/notification/displayNotification';
import notifee, {EventType} from '@notifee/react-native';
import {getFcmToken} from './Screen/Chat/notification/services';

// import firebase

// import {getFcmToken} from './Screen/Chat/notification/services';
// import StartNotify from './StartNotify.text';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

// import {Store} from './Redux/Slice/Store';
// import strings from './constants/lang';

// 2024-02-14 : 버그 Fix, RootStackParamList 를 추가함. 타입을 지정
// const Stack = createStackNavigator<RootStackParamList>();

// 2024-11-11 : 구글 sing in configuration

// GoogleSignin.configure({
//   webClientId:
//     '858777442491-14jgv82c6dgo732p6qjv5lhlndotdn4h.apps.googleusercontent.com',
//   forceCodeForRefreshToken: true,
//   offlineAccess: true,
//   iosClientId:
//     '858777442491-od1pqhd3ekeubrpv5a87d7d8g33f7k8a.apps.googleusercontent.com',
// });

// let firebase, messaging;

// if (Platform.OS === 'android') {
//   console.log('index : android >>>>>');
// }

const App: React.FC = () => {
  // const {changeLanguage} = useContext(LanguageContext);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('App.tsx:');

    let unsubscribeForegroundMessage: () => void;
    let unsubscribeBackgroundMessage: () => void;

    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);

    if (!__DEV__) {
      console.log('This is in production mode and ignore console.log');
      console.log = () => {};
    } else {
      console.log('This is in debug mode and activate console.log');
    }

    getFcmToken();
    requestNotificationPermission();

    // initializeNotificationChannel();

    unsubscribeForegroundMessage = messaging().onMessage(
      async remoteMessage => {
        console.log('Foreground FCM Message:', remoteMessage);
        // Handle the notification in the foreground
        //   await initializeNotificationChannel();
        await displayNotification(remoteMessage);
      },
    );

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      await displayNotification(remoteMessage);
    });

    notifee.onForegroundEvent(({type, detail}) => {
      console.log('Notifee Foreground Event:', type, detail);

      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification);
      }

      if (type === EventType.ACTION_PRESS) {
        console.log('Notification action pressed:', detail.pressAction);
      }
    });

    // // Background event handler
    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log('Notifee Background Event:', type, detail);

      if (type === EventType.PRESS) {
        // 사용자 알림 클릭 이벤트 처리
        console.log('Notification pressed:', detail.notification);
      }

      if (type === EventType.ACTION_PRESS) {
        // 알림 액션 버튼 클릭 이벤트 처리
        console.log('Notification action pressed:', detail.pressAction);
      }
    });

    setLanguage();
    return () => {
      if (unsubscribeForegroundMessage) {
        console.error('unsubscribe foreground');
        unsubscribeForegroundMessage();
      }
      // if (unsubscribeBackgroundMessage) {
      //   console.error('unsubscribe foreground');
      //   unsubscribeForegroundMessage();
      // }
    };
  }, []);

  async function requestNotificationPermission() {
    console.log('Platform.version = ', Platform.Version);

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('알림 권한 상태:', hasPermission);

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      console.error('permission ');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message:
            'This app needs notification permissions to send you alerts.',
          buttonPositive: 'Allow',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    } else {
      console.log(
        'Notification permission is not required for this Android version.',
      );
    }
  }

  const setLanguage = async () => {
    await AsyncStorage.setItem('language', 'kr');
    strings.setLanguage('kr');
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <Provider store={store}>
          <NavigationContainer>
            {/* <StartNotify /> */}

            <MainTab />
          </NavigationContainer>
        </Provider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
