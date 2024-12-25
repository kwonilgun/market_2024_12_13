/*
 * File: MainTab.tsx
 * Project: market_2024_12_13
 * File Created: Saturday, 14th December 2024 7:52:19 am
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * -----
 * Last Modified: Saturday, 14th December 2024 8:46:02 am
 * Modified By: Kwonilgun(권일근) (kwonilgun@naver.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 * 1. 2024-12-14 : Main tab 생성
 */

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {View} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useAuth} from '../context/store/Context.Manager';
import HomeNavigator from './HomeNavigator';
import UserNavigator from './UserNavigator';

import {RFPercentage} from 'react-native-responsive-fontsize';
import AdminNavigator from './AdminNavigator';
import {Platform} from 'react-native';
import CartNavigator from './CartNavigator';
import ShippingNavigator from './ShippingNavigator';
import PaymentNavigator from './PaymentNavigator';

// const Tab = createBottomTabNavigator();

const Tab = createBottomTabNavigator<RootTabParamList>();

// Define the type for the tab navigator's parameters
type RootTabParamList = {
  Home: undefined;
  UserMain: undefined;
  Admin: undefined;
  ShoppingCart: undefined;
  ShippingNavigator: undefined;
  PaymentNavigator: undefined;

  // Chat: undefined;
};

const MainTab: React.FC = () => {
  const {state} = useAuth();

  console.log('MainTab.jsx 진입 .... state.isAdmin = ', state.user?.isAdmin);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#e91e63',
          headerShown: false, //2022-12-16 Button Tab Navigator의 제목을 삭제하는 옵션이다.
          tabBarShowLabel: false,
          tabBarStyle: [
            {
              display: 'flex',
              backgroundColor: 'white',
              alignItems: 'center',
              alignContent: 'center',
              // height: Math.round(intHeight * 0.08),
              height: RFPercentage(8),
              // width: width * 0.1,
              borderTopWidth: 4, // 경계선 두께 (진하게 조정)
              borderTopColor: 'black', // 경계선 색상 (예: 검정색)
            },
            null,
          ],
        }}>
        {/* 2024-06-14 : 홈 메뉴 추가 */}
        {state.isAuthenticated ? (
          <Tab.Screen
            name="Home"
            component={HomeNavigator}
            options={{
              tabBarIcon: ({color}) => (
                // <Icon name="home" color={color} size={RFPercentage(5)} />
                <FontAwesome
                  style={{
                    color: color,

                    height: Platform.OS === 'ios' ? undefined : RFPercentage(7),
                    // width: RFPercentage(10),
                    fontSize:
                      Platform.OS === 'ios'
                        ? RFPercentage(4)
                        : RFPercentage(5.5),
                  }}
                  name="home"
                />
              ),
            }}
          />
        ) : null}

        {!state.user?.isAdmin &&
        !state.user?.isProducer &&
        state.isAuthenticated ? ( //소비자인 경우
          <Tab.Screen
            name="ShoppingCart"
            component={CartNavigator}
            options={{
              tabBarIcon: ({color}) => (
                <>
                  <FontAwesome
                    style={{
                      color: color,
                      // height: RFPercentage(7),
                      // width: RFPercentage(10),
                      height:
                        Platform.OS === 'ios' ? undefined : RFPercentage(7),
                      fontSize:
                        Platform.OS === 'ios'
                          ? RFPercentage(4)
                          : RFPercentage(5.5),
                    }}
                    name="shopping-cart"
                  />
                  {/* 2023-06-20 :장바구니에 담겨진 갯수 표시 */}
                  {/* <CartIcon /> */}
                </>
              ),
            }}
          />
        ) : null}

        {/* bank icon 이용방법 참조 사이트 : https://stackoverflow.com/questions/67581338/material-community-icons-do-not-show-in-react-native  */}
        {!state.user?.isAdmin &&
        !state.user?.isProducer &&
        state.isAuthenticated ? (
          //소비자인 경우
          <Tab.Screen
            name="ShippingNavigator"
            component={ShippingNavigator}
            options={{
              tabBarIcon: ({color}) => (
                <FontAwesome
                  style={{
                    color: color,
                    // height: RFPercentage(7),
                    // width: RFPercentage(10),
                    height: Platform.OS === 'ios' ? undefined : RFPercentage(7),
                    fontSize:
                      Platform.OS === 'ios'
                        ? RFPercentage(3.5)
                        : RFPercentage(5.5),
                  }}
                  name="truck"
                />
              ),
            }}
          />
        ) : null}

        {/* bank icon 이용방법 참조 사이트 : https://stackoverflow.com/questions/67581338/material-community-icons-do-not-show-in-react-native  */}
        {!state.user?.isAdmin &&
        !state.user?.isProducer &&
        state.isAuthenticated ? (
          //소비자인 경우
          <Tab.Screen
            name="PaymentNavigator"
            component={PaymentNavigator}
            options={{
              tabBarIcon: ({color}) => (
                <FontAwesome
                  style={{
                    color: color,
                    // height: RFPercentage(7),
                    // width: RFPercentage(10),
                    height: Platform.OS === 'ios' ? undefined : RFPercentage(7),
                    fontSize:
                      Platform.OS === 'ios'
                        ? RFPercentage(3.5)
                        : RFPercentage(5.5),
                  }}
                  name="krw"
                />
              ),
            }}
          />
        ) : null}

        <Tab.Screen
          name="UserMain"
          component={UserNavigator}
          options={{
            tabBarIcon: ({color}) => (
              //     <Icon name="user" color={color} size={25} />
              <FontAwesome
                style={{
                  color: color,
                  // height: RFPercentage(7),
                  // width: RFPercentage(10),
                  height: Platform.OS === 'ios' ? undefined : RFPercentage(5),
                  fontSize:
                    Platform.OS === 'ios' ? RFPercentage(4) : RFPercentage(5.5),
                }}
                name="user"
              />
            ),
          }}
        />

        {state.isAuthenticated && state.user?.isAdmin ? (
          <Tab.Screen
            name="Admin"
            component={AdminNavigator}
            options={{
              tabBarIcon: ({color}) => (
                <FontAwesome
                  style={{
                    color: color,
                    // height: RFPercentage(7),
                    // width: RFPercentage(10),
                    height: Platform.OS === 'ios' ? undefined : RFPercentage(7),
                    fontSize:
                      Platform.OS === 'ios'
                        ? RFPercentage(4)
                        : RFPercentage(5.5),
                  }}
                  name="cog"
                />
              ),
            }}
          />
        ) : null}
      </Tab.Navigator>

      {/* </SafeAreaView> */}
    </>
  );
};

export default MainTab;
