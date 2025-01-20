/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuth} from '../context/store/Context.Manager';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import CartNavigator from './CartNavigator';
import ShippingNavigator from './ShippingNavigator';
import PaymentNavigator from './PaymentNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage } from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppState, AppStateStatus, Linking, Platform } from 'react-native';
import notifee, {EventType} from '@notifee/react-native';


const Tab = createBottomTabNavigator<RootTabParamList>();

type RootTabParamList = {
  Home: undefined;
  UserMain: undefined;
  Admin: undefined;
  ShoppingCart: undefined;
  ShippingNavigator: undefined;
  PaymentNavigator: undefined;
};

const getTabIconStyle = () => ({
  color: undefined,
  height: Platform.OS === 'ios' ? RFPercentage(6) : RFPercentage(7),
  width: Platform.OS === 'ios' ? RFPercentage(6) : RFPercentage(7),
  marginTop: Platform.OS === 'ios' ? RFPercentage(1) : RFPercentage(2),
  padding: RFPercentage(1),
  fontSize: Platform.OS === 'ios' ? RFPercentage(4) : RFPercentage(4),
});

const TabIcon = ({name, color}: {name: string; color: string}) => (
  <FontAwesome style={{...getTabIconStyle(), color}} name={name} />
);

const MainTab: React.FC<{initialUrl: string | null}> = ({initialUrl}) => {
  const {state, badgeCountState, badgeCountDispatch} = useAuth();
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [status, setStatus] = useState<string>("정상 상태");

  const isAuthenticated = state.isAuthenticated;
  const isAdmin = state.user?.isAdmin;
  const isProducer = state.user?.isProducer;

  if (Platform.OS === 'android') {
    // const notifee = require('@notifee/react-native').default;
    // const {EventType} = require('@notifee/react-native');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      console.log('MainTab ... 진입');
      // 알림 수신 시 뱃지 카운트 업데이트
      const subscription = notifee.onForegroundEvent(({type, detail}) => {
        console.log('MainTab type = ', type, detail);
        if (type === EventType.DELIVERED) {
          console.log('MainTab, onForegroundEvent');
          setBadgeCount(1);
        }
      });

      const fetchBadgeCount = async () => {
        console.log('badgeCount = ', badgeCountState.isBadgeCount);
        const count = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
        setBadgeCount(count);
      };

      fetchBadgeCount();

     
      // 초기 URL 처리
      if (initialUrl) {
        console.log('Handling initial URL:', initialUrl);
        if (initialUrl === 'myapp://UserMain') {
          // UserMain으로 이동
          console.log('Navigate to UserMain from initial URL');
          // setBadgeCount(prevCount => prevCount + 1);
        }
      }

      // 딥 링크 이벤트 처리
      const handleLink = (url: any) => {
        if (url === 'myapp://UserMain') {
          console.log('handleLink count 증가');
          // setBadgeCount(prevCount => prevCount + 1); // 뱃지 증가
        }
      };

      Linking.addEventListener('url', handleLink);

      return () => {
        subscription();
        Linking.removeAllListeners('myapp://UserMain');
      };
    }, []);
  }
  if (Platform.OS === 'ios') {
    // const notifee = require('@notifee/react-native').default;
    // const {EventType} = require('@notifee/react-native');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // 알림 수신 시 뱃지 카운트 업데이트
      const subscription = notifee.onForegroundEvent(({type, detail}) => {
        console.log('MainTab type = ', type, detail);
        if (type === EventType.DELIVERED) {
          setBadgeCount(1);
        }
      });

      const fetchBadgeCount = async () => {
        const count = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
        
        // const count = badgeCountState.isBadgeCount;
        console.log('MainTab count = ', count);
        setBadgeCount(prevCount => prevCount + count);
        setBadgeCount(count);
      };

      fetchBadgeCount();

      return () => {
        subscription();
        setBadgeCount(0);

      };
    }, []);
  }


  useEffect(() => {

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('앱이 백그라운드에서 포그라운드로 전환되었습니다.');

        // badgeCountDispatch({type: 'increment'});
        // 업데이트 로직 실행
        // setBadgeCount(1);
        checkBackgroundUpdate();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, badgeCountDispatch]);

  const checkBackgroundUpdate = async () => {
    // 예: 백엔드와 통신하거나 상태를 확인하는 로직
    // setStatus("백그라운드에서 상태 변경을 감지했습니다!");
    const count = parseInt(await AsyncStorage.getItem('badgeCount') || '0', 10);
        
        // const count = badgeCountState.isBadgeCount;
        console.log('MainTab count = ', count);
        setBadgeCount(prevCount => prevCount + count);
        setBadgeCount(count);
  };

  // 알림 취소 함수
const cancelNotifications = async () => {
  try {
    // 현재 표시 중인 알림 가져오기
    
      // 표시 중인 알림이 있으면 취소
      await AsyncStorage.removeItem('badgeCount');
      await notifee.cancelAllNotifications(); // 모든 알림 취소
      console.log('All notifications canceled');
    
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
};
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#e91e63',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'flex',
          backgroundColor: 'white',
          alignItems: 'center',
          height: RFPercentage(8),
          borderTopWidth: 4,
          borderTopColor: 'black',
        },
      }}>
      {isAuthenticated && (
        <Tab.Screen
          name="Home"
          component={HomeNavigator}
          options={{
            tabBarIcon: ({color}) => <TabIcon name="home" color={color} />,
          }}
        />
      )}

      {!isAdmin && !isProducer && isAuthenticated && (
        <>
          <Tab.Screen
            name="ShoppingCart"
            component={CartNavigator}
            options={{
              tabBarIcon: ({color}) => (
                <TabIcon name="shopping-cart" color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ShippingNavigator"
            component={ShippingNavigator}
            options={{
              tabBarIcon: ({color}) => <TabIcon name="truck" color={color} />,
            }}
          />
          <Tab.Screen
            name="PaymentNavigator"
            component={PaymentNavigator}
            options={{
              tabBarIcon: ({color}) => <TabIcon name="krw" color={color} />,
            }}
          />
        </>
      )}

      <Tab.Screen
        name="UserMain"
        component={UserNavigator}
        listeners={{
          tabPress: () => {
            console.log('사용자 tab pressed');
            setBadgeCount(0); // Chat 탭을 누르면 뱃지 초기화
            cancelNotifications();
          },
        }}
        options={{
          tabBarIcon: ({color}) => <TabIcon name="user" color={color} />,
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
        }}
      />

      {isAuthenticated && isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({color}) => <TabIcon name="cog" color={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainTab;
