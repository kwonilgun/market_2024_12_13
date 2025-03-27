/* eslint-disable react/jsx-no-undef */
/*
 * File: Membership.Screen.tsx
 * Project: market_2024_12_13
 * File Created: Thursday, 19th December 2024 7:34:29 am
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * -----
 * Last Modified: Thursday, 19th December 2024 8:03:43 am
 * Modified By: Kwonilgun(권일근) (kwonilgun@naver.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 * 2024-12-19 : 코드 생성
 */

/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { ReactElement, useEffect } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, TouchableOpacity,
  View
} from 'react-native';


import { NaverLoginScreenProps } from '../model/types/TUserNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import colors from '../../styles/colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/GlobalStyles';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../../assets/common/BaseUrl';


const Gap = (): ReactElement => <View style={{ marginTop: 24 }} />;

const NaverLoginScreen: React.FC<NaverLoginScreenProps> = props => {

  useEffect(() => {
    console.log('NaverLoginScreen - useEffect');
    GoogleSignin.configure({
      webClientId: '60338696147-ba7sethhai2vluk5np1gmluta1eliuoo.apps.googleusercontent.com',
      // iosClientId: GOOGLE_IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
    });
    return () => {
      console.log('NaverLoginScreen - return');
    };
  }, []);

  const login = async (): Promise<void> => {
    console.log('Google Login');


    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokenId = userInfo.data?.idToken;
      const token = {token: tokenId};
      console.log('token = ', token);

      const response: AxiosResponse = await axios.post(
        `${baseURL}users/google`,
        JSON.stringify(token),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Google Login Success:', response.data);
    } catch (error) {
      console.error('Google Login Failed:', error);
    }

  };

  const logout = async (): Promise<void> => {
    try {
      await GoogleSignin.signOut();
      // Perform additional cleanup and logout operations.
      console.log('google sign out 성공');
    } catch (error) {
      console.log('Google Sign-Out Error: ', error);
    }
  };

  // const getProfile = async (): Promise<void> => {
  // };

  const backToLogin = async (props: any) => {
    console.log('Membership.screen.tsx: backTo Login 함수 실행 \n');

    const value = await AsyncStorage.getItem('language');
    if (value === 'kr') {
      console.log('Membership.screen language=', value);
    } else {
      // changeLanguage('en');
      console.log('Membership.screen language=', value);
    }

    props.navigation.navigate('LoginScreen');
  };

  const LeftCustomComponent = () => {
    return (
      <TouchableOpacity onPress={() => backToLogin(props)}>
        <>
          {/* <Text style={styles.leftTextStyle}>홈</Text> */}
          <FontAwesome
            style={{
              height: RFPercentage(8),
              width: RFPercentage(10),
              marginTop: RFPercentage(2),
              color: colors.black,
              fontSize: RFPercentage(5),
              fontWeight: 'bold',
              // transform: [{scaleX: 1.5}], // 폭을 1.5배 넓힘
            }}
            name="arrow-left"
          />
        </>
      </TouchableOpacity>
    );
  };



  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        centerText= '구글 로그인'
        containerStyle={{paddingHorizontal: 8}}
        isRight={false}
        // rightText={'       '}
        // rightTextStyle={{color: colors.lightBlue}}
        // onPressRight={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
       <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
      >
        <Button title={'Login'} onPress={login} />
        <Gap />
        <Button title={'Logout'} onPress={logout} />
        <Gap />
{/*         
          <>
            <Button title="Get Profile" onPress={getProfile} />
            <Gap />
          </>
         */}
        
      </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({

  inputTitle: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.0),
    marginTop: RFPercentage(1),
    color: 'black',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  errorMessage: {
    color: 'red',
    margin: RFPercentage(1),
    fontSize: RFPercentage(2.6),
    fontWeight: 'bold',
  },
  
});

export default NaverLoginScreen;
