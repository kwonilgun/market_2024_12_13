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
import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform, StyleSheet,
  Text, TouchableOpacity
} from 'react-native';

import isEmpty from '../../utils/isEmpty';

import { NaverLoginScreenProps } from '../model/types/TUserNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/GlobalStyles';



const NaverLoginScreen: React.FC<NaverLoginScreenProps> = props => {

  useEffect(() => {
    console.log('NaverLoginScreen - useEffect');
    return () => {
      console.log('NaverLoginScreen - return');
    };
  }, []);


  // eslint-disable-next-line @typescript-eslint/no-shadow
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
        centerText={strings.MEMBERSHIP}
        containerStyle={{paddingHorizontal: 8}}
        isRight={false}
        // rightText={'       '}
        // rightTextStyle={{color: colors.lightBlue}}
        // onPressRight={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
       <Text>네이버 로그인</Text>
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
