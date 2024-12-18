import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../Screen/model/types/TUserNavigator';
import LoginScreen from '../Screen/Login.Screen';
import {useAuth} from '../context/store/Context.Manager';
import ProfileScreen from '../Screen/ProfileScreen';
// import AuthorizeScreen from '../../Screen/Login/Authorize.Screen';
// import WifiTestScreen from '../../Screen/Wifi/WifiTestScreen';
// import SettingScreen from '../../Screen/Wifi/SettingScreen';
// import StartScreen from '../../Screen/Wifi/StartScreen';

// import MembershipScreen from '../../Screen/Login/Membership.Screen';
// import SystemInfoScreen from '../../Screen/Wifi/SystemInfoScreen';
// import SoftApScreen from '../../Screen/Wifi/SoftApScreen';
// import PrivacyPolicyScreen from '../../Screen/TermsAndConditions/PrivacyPolicyScreen';
// import PasswordResetScreen from '../../Screen/Login/PasswordReset.Screen';
// import ChangePasswordScreen from '../../Screen/Login/ChangePassword.Screen';
// import UsageTermScreen from '../../Screen/TermsAndConditions/UsageTermScreen';
// import MembershipUsageTermScreen from '../../Screen/TermsAndConditions/MembershipUsageTermScreen';
// import MembershipPrivacyPolicyScreen from '../../Screen/TermsAndConditions/MembershipPrivacyPolicyScreen';

// 2024-02-14 : 버그 Fix, RootStackParamList 를 추가함. 타입을 지정
const Stack = createStackNavigator<RootStackParamList>();

function MyStack() {
  const {state} = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#e6efd0',
          height: 30,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          // fontWeight: "bold",
          color: 'black',
        },
      }}>
      {/* 2024-05-02 : 하단 탭 메뉴에서 로그인 탭을 눌러도 그대로 있도록 하기 위해서 로그인 상태를 체크해서, 로그인 상태이면 ProfileScreen을 유지 */}

      {state.isAuthenticated ? (
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={({navigation, route}) => ({
            headerShown: false,
            headerLeft: () => null,
            title: '사용자',
            // headerTitle: props => (
            //   <LogoTitle title="루트원 마켓" navigation={navigation} />
            // ),
          })}
        />
      ) : (
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={({navigation, route}) => ({
            headerShown: false,
            headerLeft: () => null,
            title: '로그인',
            // headerTitle: props => (
            //   <LogoTitle title="루트원 마켓" navigation={navigation} />
            // ),
          })}
        />
      )}

      {/* <Stack.Screen
        name="AuthorizeScreen"
        component={AuthorizeScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '인증 확인',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      /> */}
      {/* <Stack.Screen name="OrderListsScreen" component={OrderListsScreen} />
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} /> */}
      {/* <Stack.Screen
        name="WifiTestScreen"
        component={WifiTestScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '와이파이',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      /> */}

      {/* 2024-05-31 : 하단 icon을 선택 시에 SystemInfo로 들어가는 문제 Fix */}
      {/* {state.isAuthenticated ? (
        <Stack.Screen
          name="SystemInfoScreen"
          component={SystemInfoScreen}
          options={({navigation, route}) => ({
            headerShown: false,
            headerLeft: () => null,
            title: '시스템 정보',
            // headerTitle: props => (
            //   <LogoTitle title="루트원 마켓" navigation={navigation} />
            // ),
          })}
        />
      ) : null} */}

      {/* <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '와이파이',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '오존 동작',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="MembershipScreen"
        component={MembershipScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '회원 가입',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="SoftApScreen"
        component={SoftApScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '회원 가입',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '개인정보',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="MembershipPrivacyPolicyScreen"
        component={MembershipPrivacyPolicyScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '개인정보',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="UsageTermScreen"
        component={UsageTermScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '개인정보',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />

      <Stack.Screen
        name="MembershipUsageTermScreen"
        component={MembershipUsageTermScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '개인정보',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />

      <Stack.Screen
        name="PasswordResetScreen"
        component={PasswordResetScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '패스워드리셋',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: () => null,
          title: '패스워드리셋',
          // headerTitle: props => (
          //   <LogoTitle title="루트원 마켓" navigation={navigation} />
          // ),
        })}
      /> */}
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return <MyStack />;
}
