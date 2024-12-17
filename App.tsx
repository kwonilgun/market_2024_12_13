/* eslint-disable prettier/prettier */
/*
 * File: App.tsx
 * Project: root_project
 * File Created: Wednesday, 14th February 2024
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright : 루트원 AI
 */

import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {AuthProvider} from './context/store/Context.Manager';
import MainTab from './Navigator/MainTab';
import store from './Redux/Cart/Store/store';
import {LogBox, Platform} from 'react-native';

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

const App: React.FC = () => {
  // const {changeLanguage} = useContext(LanguageContext);
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

    setLanguage();

    // Only for iOS, set the badge count
    // if (Platform.OS === 'ios') {
    //   PushNotificationIOS.setApplicationIconBadgeNumber(0);
    //   // notification.finish(PushNotificationIOS.FetchResult.NoData);
    // } else {
    //   Badge.setCount(0);
    // }

    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 2000);
  }, []);

  const setLanguage = async () => {
    await AsyncStorage.setItem('language', 'kr');
    strings.setLanguage('kr');

    // if (language === 'kr') {
    //   strings.setLanguage('kr');
    //   // await AsyncStorage.setItem('language', 'kr');

    //   // changeLanguage('kr');
    // } else {
    //   strings.setLanguage('en');
    //   // await AsyncStorage.setItem('language', 'en');
    //   // changeLanguage('en');
    // }
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
