/*
 * File: CartMainScreen.tsx
 * Project: market_2024_12_13
 * File Created: Saturday, 21st December 2024 10:52:45 am
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * -----
 * Last Modified: Saturday, 21st December 2024 10:58:26 am
 * Modified By: Kwonilgun(권일근) (kwonilgun@naver.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 * 2024-12-21 : 생성
 */

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import strings from '../../constants/lang';
import {useFocusEffect} from '@react-navigation/native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import GlobalStyles from '../../styles/GlobalStyles';
import {CartMainScreenProps} from '../model/types/TUserNavigator';

const CartMainScreen: React.FC<CartMainScreenProps> = props => {
  useFocusEffect(
    useCallback(() => {
      return () => {
        //    setContents(undefined);
        //    setReady(false);
      };
    }, []),
  );

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={strings.SHOPPING_CART}
        isLeftView={false}
        //    leftCustomView={LeftCustomComponent}
        containerStyle={{paddingHorizontal: 8}}
        isRight={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        <View style={GlobalStyles.VStack}>
          <View style={GlobalStyles.totalInput}>
            <Text style={GlobalStyles.inputTitle}>쇼핑카드 테스트 스크린</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  Title: {
    marginTop: RFPercentage(10),
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(3),
  },

  subTitle: {
    marginTop: RFPercentage(1),
    marginBottom: RFPercentage(5),
    marginHorizontal: RFPercentage(2),
    padding: RFPercentage(1),
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: RFPercentage(1.8),
  },
});
export default CartMainScreen;
