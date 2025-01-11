/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Linking, Platform} from 'react-native';

import {useAuth} from '../context/store/Context.Manager';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import CartNavigator from './CartNavigator';
import ShippingNavigator from './ShippingNavigator';
import PaymentNavigator from './PaymentNavigator';

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

const MainTab: React.FC = () => {
  const {state} = useAuth();
  const [badgeCount, setBadgeCount] = useState<number>(0);

  const isAuthenticated = state.isAuthenticated;
  const isAdmin = state.user?.isAdmin;
  const isProducer = state.user?.isProducer;

  if (Platform.OS === 'android') {
    const notifee = require('@notifee/react-native').default;
    const {EventType} = require('@notifee/react-native');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // 알림 수신 시 뱃지 카운트 업데이트
      const subscription = notifee.onForegroundEvent(({type, detail}) => {
        console.log('MainTab type = ', type);
        if (type === EventType.DELIVERED) {
          setBadgeCount(prevCount => prevCount + 1);
        }
      });

      // 딥 링크 이벤트 처리
      const handleLink = ({url}) => {
        if (url === 'myapp://UserMain') {
          console.log('handleLink count 증가');
          setBadgeCount(prevCount => prevCount + 1); // 뱃지 증가
        }
      };

      Linking.addEventListener('url', handleLink);

      return () => {
        subscription();
        Linking.removeAllListeners('myapp://UserMain');
      };
    }, []);
  }

  // 알림 취소 함수
  const cancelNotifications = async () => {
    if (Platform.OS === 'android') {
      const notifee = require('@notifee/react-native').default;

      try {
        await notifee.cancelAllNotifications(); // 모든 알림 취소
        console.log('All notifications canceled');
      } catch (error) {
        console.error('Failed to cancel notifications:', error);
      }
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
