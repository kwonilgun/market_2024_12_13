/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import WrapperContainer from '../../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../../styles/GlobalStyles';
// import Voice from '@react-native-community/voice';

import LoadingWheel from '../../../utils/loading/LoadingWheel';
import { FindOrderNumberScreenProps, OrderAIScreenProps } from '../../model/types/TAdminOrderNavigator';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../../../assets/common/BaseUrl';
import { IOrderInfo } from '../../model/interface/IOrderInfo';
import deleteOrder from '../../Orders/deleteOrder';
import { getToken } from '../../../utils/getSaveToken';


interface OrderDetails {
  // 주문 정보의 구조에 따라 이 인터페이스를 정의하세요.
  // 예시:
  orderId: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrderAIScreen: React.FC<OrderAIScreenProps> = props => {
  const [orderNumber, setOrderNumber] = useState<string>('123456');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);


  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('OrderAIScreen : useFocusEffect');
  //     Voice.onSpeechResults = (e) => {
  //       const recognizedText = e.value![0];
  //       setOrderNumber(recognizedText);
  //       stopListening();
  //     };
  
  //     return () => {
  //       Voice.destroy().then(Voice.removeAllListeners);
  //     };
  //   }, []),
  // );

  // // 음성 인식 시작
  // const startListening = async () => {
  //   try {
  //     await Voice.start('en-US');
  //     setIsListening(true);
  //   } catch (error) {
  //     console.error('Error starting voice recognition:', error);
  //   }
  // };

  // // 음성 인식 중지
  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //     setIsListening(false);
  //   } catch (error) {
  //     console.error('Error stopping voice recognition:', error);
  //   }
  // };

  // 주문 정보 조회
  const fetchOrderDetails = async (): Promise<void> => {

    const token = await getToken();
    //헤드 정보를 만든다.
    const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
    };
    const data = {orderNumber: orderNumber};
    try {
      const response: AxiosResponse =  await axios.post(
        `${baseURL}gemini/orderNumber`,
        JSON.stringify(data),
        config,
      ); 
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };


  const onPressLeft = () => {
    props.navigation.navigate('AdminOrderMainScreen');
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
        centerText="주문 현황"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />

      {/* {loading ? (
        <>
          <LoadingWheel />
        </>
      ) : ( */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.containerKey}>

        <Text style={{ fontSize: 18, marginBottom: 16 }}>
                주문 번호: {orderNumber}
        </Text>

        <Button title="주문 정보 조회" onPress={fetchOrderDetails} />
        {orderDetails && (
          <ScrollView style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 16 }}>주문 정보:</Text>
            <Text>{JSON.stringify(orderDetails, null, 2)}</Text>
          </ScrollView>
        )}
        {/* <Button
                title={isListening ? '음성 인식 중...' : '음성으로 주문 번호 입력'}
                onPress={startListening}
        /> */}
          {/* 추가: 검색 입력 필드
          <TextInput
            style={styles.searchInput}
            placeholder="주문 번호를 입력하세요"
            value={searchText}
            onChangeText={handleSearch}
          />

          {renderOrderList(props)} */}


        </KeyboardAvoidingView>
      {/* )} */}
    </WrapperContainer>
  );
};

// const styles = StyleSheet.create({
//     listContainer: {
//         margin: 8,
//         padding: 16,
//         borderWidth: 1,
//         borderRadius: 10,
//         backgroundColor: '#E0E0E0',
//       },
//       itemContainer: {
//         marginBottom: 10,
//       },
//       // 추가: 검색 입력 필드 스타일
//       searchInput: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         margin: 8,
//       },

//       orderListContainer: {
//           padding: 10,
//         },
//       orderItem: {
//         padding: 10,
//         marginBottom: 5,
//         backgroundColor: colors.grey,
//         borderRadius: 5,
//       },
//       orderName: {
//         fontSize: 16,
//         color: colors.black,
//       },
//       title: {
//         fontWeight: 'bold',
//         fontSize: 18,
//         marginBottom: 10,
//         color: 'black',
//       },
//       emptyMessage: {
//         fontSize: 16,
//         color: '#888',
//         textAlign: 'center',
//         marginTop: 20,
//       },
// });

export default OrderAIScreen;
