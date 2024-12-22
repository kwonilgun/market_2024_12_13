/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import {RFPercentage} from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../styles/colors';
import strings from '../../constants/lang';
import {useFocusEffect} from '@react-navigation/native';

import {useAuth} from '../../context/store/Context.Manager';

import GlobalStyles from '../../styles/GlobalStyles';
import {ShippingRegisterScreenProps} from '../model/types/TShippingNavigator';

const ShippingRegisterScreen: React.FC<ShippingRegisterScreenProps> = props => {
  const {state, dispatch} = useAuth();

  useFocusEffect(
    useCallback(() => {
      console.log('ShippingRegisterScreen : useFocusEffect');

      return () => {};
    }, []),
  );

  const onPressLeft = () => {
    props.navigation.navigate('ShippingMainScreen');
  };

  const LeftCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressLeft}>
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
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={strings.SYSINFO}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        <ScrollView style={GlobalStyles.scrollView}>
          <View style={GlobalStyles.VStack}>
            <Text> Shipping Register 스크린 </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    color: colors.white,
  },
});

export default ShippingRegisterScreen;
