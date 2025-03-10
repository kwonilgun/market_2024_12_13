/* eslint-disable react-hooks/exhaustive-deps */


import {useEffect, useState} from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useAuth } from './context/store/Context.Manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {EventType} from '@notifee/react-native';



const StartNotify: React.FC = () => {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
    const { badgeCountDispatch} = useAuth();

    useEffect(() => {

        // 백그라운드에서 메시지를 받을 때 저장
        console.log('StartNotify - ----');

        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
          if (appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('StartNotify 앱이 백그라운드에서 포그라운드로 전환되었습니다.');
            if(Platform.OS === 'android'){
              checkBackgroundUpdate();
            }
            if(Platform.OS === 'ios'){
              // ✅ iOS는 FCM의 데이터 메시지를 활용하여 배지 카운트 증가
              messaging()
              .getInitialNotification()
              .then(remoteMessage => {
                if (remoteMessage) {
                  console.log('StartNotify handleAppStateChange-ios, remoteMessage', remoteMessage);
                  badgeCountDispatch({ type: 'increment' });
                } else {
                  console.log('StartNotify handleAppStateChange-ios, remoteMessage 없음');
                  // checkBackgroundUpdate();
                }
              });
            }
          }
          setAppState(nextAppState);
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
          subscription.remove();
        //   unsubscribe();
        };
    }, []);

    useEffect(() => {

      // 앱이 종료된 상태에서 푸시 알림을 통해 열렸을 경우 처리
        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('앱이 종료된 상태에서 getInitialNotification:', remoteMessage);
                badgeCountDispatch({ type: 'increment' });
            }
        });

        // 앱이 백그라운드 상태에서 푸시 알림을 통해 열렸을 경우 처리
        const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
          if (remoteMessage) {
            console.log('앱이 백그라운드에서 onNotificatioOpenedApp.', remoteMessage);
            badgeCountDispatch({ type: 'increment' });
          }
        });

        // 2025-03-10 11:38:54
        const subscription = notifee.onForegroundEvent(({type, detail}) => {
          console.log('MainTab-ios type = ', type, detail);
          if (type === EventType.DELIVERED) {
            // console.log('MainTab.tsx ios type = ', type, detail);
            // setBadgeCount(badgeCountState.isBadgeCount);
             // 2025-03-05 10:54:33: badge increment를 전달하기 위해서 추가 함.
            badgeCountDispatch({type: 'increment'});
          }
        });

        return () => {
          unsubscribe();
          subscription();
        } 
      }, []);


  const checkBackgroundUpdate = async () => {
    // 예: 백엔드와 통신하거나 상태를 확인하는 로직
    // setStatus("백그라운드에서 상태 변경을 감지했습니다!");
    const count = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);

    console.log('StartNotify count = ', count);
    badgeCountDispatch({'type':'increment'});
    // setBadgeCount(prevCount => prevCount + count);
  };


  return null;
};

export default StartNotify;
