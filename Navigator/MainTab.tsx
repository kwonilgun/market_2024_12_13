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

// const Tab = createBottomTabNavigator();

const Tab = createBottomTabNavigator<RootTabParamList>();

// Define the type for the tab navigator's parameters
type RootTabParamList = {
  Home: undefined;
  'User Main': undefined;
  Admin: undefined;
  // Chat: undefined;
};

const MainTab: React.FC = () => {
  const {state} = useAuth();
  // console.log(
  //   'MainTab.jsx 진입 .... state.isAuthenticated = ',
  //   state.isAuthenticated,
  // );
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
              height: RFPercentage(7), // 적절한 높이 설정
              paddingTop: RFPercentage(1),
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

        <Tab.Screen
          name="User Main"
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
