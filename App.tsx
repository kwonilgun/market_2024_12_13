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
import {
  Alert,
  Linking,
  LogBox,
  PermissionsAndroid,
  Platform,
} from 'react-native';

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

import {getFcmToken} from './Screen/Chat/notification/services';
import {
  notificationListeners,
  requestUserPermission,
} from './Screen/Chat/notification/notificationServices';

// import {GoogleSignin} from '@react-native-google-signin/google-signin';

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

const App: React.FC = () => {
  // const {changeLanguage} = useContext(LanguageContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const linking = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        UserMain: 'UserMain', // URL과 매칭
        Home: 'Home',
        ShoppingCart: 'ShoppingCart',
        ShippingNavigator: 'ShippingNavigator',
        PaymentNavigator: 'PaymentNavigator',
        Admin: 'Admin',
      },
    },
  };

  useEffect(() => {
    console.log('App.tsx:');

    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);

    if (!__DEV__) {
      console.log('This is in production mode and ignore console.log');
      console.log = () => {};
    } else {
      console.log('This is in debug mode and activate console.log');
    }

    if (Platform.OS === 'android') {
      notificationPermission();
      requestUserPermission();
      notificationListeners();
    }

    fetchInitialUrl();

    setLanguage();
    // if (Platform.OS === 'android') {
    //   // 앱 실행 시 뱃지 카운트 초기화
    //   const notifee = require('@notifee/react-native').default;
    //   const resetBadgeCount = async () => {
    //     await notifee.setBadgeCount(0);
    //   };
    //   resetBadgeCount();
    // }

    return () => {};
  }, []);

  const fetchInitialUrl = async () => {
    const url = await Linking.getInitialURL();
    console.log('App.tsx : Initial URL:', url);
    if (url) {
      // console.log('App.tsx : Initial URL:', url);
      setInitialUrl(url); // URL 설정
    }
  };

  async function notificationPermission() {
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
          <NavigationContainer linking={linking}>
            {/* <StartNotify /> */}

            <MainTab initialUrl={initialUrl} />
          </NavigationContainer>
        </Provider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
