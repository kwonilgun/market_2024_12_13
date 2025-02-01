/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  FlatList, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import WrapperContainer from '../../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import LoadingWheel from '../../../utils/loading/LoadingWheel';
import strings from '../../../constants/lang';

import { alertMsg } from '../../../utils/alerts/alertMsg';
import GlobalStyles from '../../../styles/GlobalStyles';
import { AdminOrderMainScreenProps } from '../../model/types/TAdminOrderNavigator';

const AdminOrderMainScreen: React.FC<AdminOrderMainScreenProps> = props => {

  useFocusEffect(
    useCallback(() => {
      console.log('AdminOrderMainScreen : useFocusEffect');
      return () => {
      };
    }, []),
  );


  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText="주문 메인"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={false}
        onPressRight={() => {}}
        isRightView={false}
      />

            <View style={styles.VStack}>


                <TouchableOpacity
                      onPress={() => {
                        console.log('주문 현황 클릭');
                        props.navigation.navigate('OrderStatusScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>전체 주문 현황</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('주문 번호 찾기 클릭');
                        props.navigation.navigate('FindOrderNumberScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>주문 번호 찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('주문 접수 클릭');
                        props.navigation.navigate('OrderRxScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>주문 접수</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('결재 완료 클릭');
                        props.navigation.navigate('PaymentCompleteScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>결재 완료</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('배송 준비 클릭');
                        props.navigation.navigate('PrepareDeliveryScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>배송 준비</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('배송 중 클릭');
                        props.navigation.navigate('DuringDeliveryScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>배송 중</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('배송 완료 클릭');
                        props.navigation.navigate('CompleteDeliveryScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>배송 완료</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('반품 요청 클릭');
                        props.navigation.navigate('RequestReturnScreen');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>반품 요청</Text>
                </TouchableOpacity>
                <TouchableOpacity
                      onPress={() => {
                        console.log('반품 완료 클릭');
                        props.navigation.navigate('CompleteReturnScreen');

                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>반품 완료</Text>
                </TouchableOpacity>


            </View>

    </WrapperContainer>
  );
};

const styles = StyleSheet.create({

    VStack: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: RFPercentage(3),
        justifyContent: 'center',
        alignItems: 'center', // 추가하여 수평 정렬
      },

    saveButton: {
        width: RFPercentage(30),
        height: 'auto',
        alignItems: 'center',
        backgroundColor: '#28a745',
        margin: RFPercentage(2),
        padding: RFPercentage(1),
        borderRadius: RFPercentage(1),
      },
    buttonText: {
          fontWeight: 'bold',
          fontSize: RFPercentage(2),
          color: colors.white,
        },
});

export default AdminOrderMainScreen;
