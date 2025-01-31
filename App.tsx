/* eslint-disable prettier/prettier */
/*
 * File: App.tsx
 * Project: root_project
 * File Created: Wednesday, 14th February 2024
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright : 루트원 AI
 * 
 * ddd
 */

import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {AuthProvider, useAuth} from './context/store/Context.Manager';
import MainTab from './Navigator/MainTab';
import store from './Redux/Cart/Store/store';
import {
  Alert,
  AppState,
  AppStateStatus,
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

import notifee from '@notifee/react-native';



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

    (async () => {
      await notifee.setBadgeCount(0); // 앱 실행 시 뱃지 초기화
    })();

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

    if(Platform.OS === 'ios'){
      console.log('ios user permission');
      requestIosUserPermission();
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


  const requestIosUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
    console.log('IOS Authorization status: ', authStatus);
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('IOS Authorization enabled: ', enabled);
    if (enabled) {

      // 표시된 알림 가져오기
      const notifications = await notifee.getDisplayedNotifications();
      console.log('App.tsx: 현재 표시된 알림:', notifications);
      if(notifications.length > 0){
          
          let count = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
           count = count + 1;
          await AsyncStorage.setItem('badgeCount', count.toString());
      }

      getFcmToken();
    }
    } catch (error) {
      console.error('request Ios user permisson 에러', error);
    }

  };

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
      console.log('permission ');
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
