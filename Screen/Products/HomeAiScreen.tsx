/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  Button, FlatList, KeyboardAvoidingView,
  Modal,
  Platform, ScrollView, StyleSheet, Text, TouchableOpacity,
  View
} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../styles/GlobalStyles';
// import Voice from '@react-native-community/voice';

import LoadingWheel from '../../utils/loading/LoadingWheel';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../../assets/common/BaseUrl';
import { getToken } from '../../utils/getSaveToken';
import { HomeAiScreenProps } from '../model/types/TUserNavigator';
import { jwtDecode } from 'jwt-decode';
import { UserFormInput } from '../model/interface/IAuthInfo';
import { height, width } from '../../styles/responsiveSize';
import { dateToKoreaDate, dateToKoreaTime } from '../../utils/time/dateToKoreaTime';
import { IOrderInfo } from '../model/interface/IOrderInfo';

interface IAiOrderList {
  orderNumber: string;
  dateOrdered: string;
}

const HomeAiScreen: React.FC<HomeAiScreenProps> = props => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showDetail, setShowDetail] = useState<string[] | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalDetail, setModalDetail] = useState<boolean>(false);
  const [productModalVisible, setProductModalVisible] = useState<boolean>(false);
  const [productNames, setProductNames] = useState<string[] | null>(props.route.params.productNames);
  const [orderList, setOrderList] = useState<IAiOrderList[] | null>(props.route.params.productNames);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);


  console.log('product names = ', props.route.params.productNames);


  useFocusEffect(
    useCallback(() => {
      console.log('OrderAIScreen : useFocusEffect');

      setLoading(false);

      return () => {
        setLoading(true);
        setModalVisible(false);
        setProductModalVisible(false);
      };
    }, []),
  );

  // 주문 정보 조회
  const fetchOrderDetails = async (item: IAiOrderList): Promise<void> => {

    setLoading(true);

    const token = await getToken();
    //헤드 정보를 만든다.
    const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
    };


    try {
      const response: AxiosResponse =  await axios.get(
        `${baseURL}gemini/order/${item.orderNumber}`,
        config,
      );

      console.log('fetchOrderDetail =', response.data);
      if(response.status === 200){
        console.log('HomeAiScreen - response.data', response.data);
        setShowDetail(response.data);
        setModalDetail(true);
      }

    } catch (error) {
      console.error('Error fetching ai order summary:', error);
    } finally{
        setLoading(false);
    }
  };

  const fetchOrderList = async (): Promise<void> => {

    setLoading(true);

    const token = await getToken();
    const decoded: UserFormInput = jwtDecode(token!);
    const userId = decoded.userId === null || undefined ? '' : decoded.userId;

    //헤드 정보를 만든다.
    const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
    };


    try {
      const response: AxiosResponse =  await axios.get(
        `${baseURL}orders/${userId}`,
        config,
      ); 
      const orders = response.data as IOrderInfo[];
      // console.log('HomeAiScreen orders = ', orders);
      const list: IAiOrderList[] = orders
            .map((order: IOrderInfo) => ({
                orderNumber: order.orderNumber,
                dateOrdered: new Date(order.dateOrdered).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            }))
            .sort((a, b) => new Date(b.dateOrdered).getTime() - new Date(a.dateOrdered).getTime());


      if(response.status === 200){
        setOrderList(list);
        setModalVisible(true);
      }

    } catch (error) {
      console.error('Error fetching ai order summary:', error);
    } finally{
        setLoading(false);
    }
  };


  const fetchProductDetails = async (productName: string): Promise<void> => {
    setLoading(true);
    const token = await getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response: AxiosResponse = await axios.get(
        `${baseURL}gemini/productDetails/${productName}`,
        config
      );
      if (response.status === 200) {
        setShowDetail(response.data);
        setModalDetail(true);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  }

  const onPressLeft = () => {
    props.navigation.goBack();
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
        centerText="인공지능"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />

      {loading ? (
        <>
          <LoadingWheel />
        </>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.containerKey}>


        {/* <Button title="우리동네 날씨" onPress={fetchMyWeather} /> */}
        <Button title="주문 정보 조회" onPress={fetchOrderList} />

        <Button title="상품 목록 보기" onPress={() => setProductModalVisible(true)} />


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* <Text style={styles.modalTitle}>주문 정보</Text> */}
                <FlatList
                  data={orderList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          // setSelectedOrder(item);
                          setModalVisible(false);
                          fetchOrderDetails(item);
                        }}
                      >
                        <Text>날짜-주문번호 : {item.dateOrdered} - {item.orderNumber}</Text>
                      </TouchableOpacity>

                    // <View style={styles.listItem}>
                    //   <Text>{item}</Text>
                    // </View>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyMessage}> 리스트 없음.</Text>
                  }
                />
                <Button title="닫기" onPress={() => setModalVisible(false)} />
              </View>
            </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={productModalVisible}
          onRequestClose={() => setProductModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={productNames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                      setSelectedProduct(item);
                      setProductModalVisible(false);
                      fetchProductDetails(item);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyMessage}> 리스트 없음.</Text>
                }
              />
              <Button title="닫기" onPress={() => setProductModalVisible(false)} />
            </View>
          </View>
        </Modal>


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalDetail}
            onRequestClose={() => setModalDetail(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* <Text style={styles.modalTitle}>주문 정보</Text> */}
                <FlatList
                  data={showDetail}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.listItem}>
                      <Text>{item}</Text>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyMessage}> 리스트 없음.</Text>
                  }
                />
                <Button title="닫기" onPress={() => setModalDetail(false)} />
              </View>
            </View>
        </Modal>


        </KeyboardAvoidingView>
      )}
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    height: RFPercentage(8),
    width: RFPercentage(10),
    marginTop: RFPercentage(2),
    color: colors.black,
    fontSize: RFPercentage(5),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    // width: width * 0.9,
    // height: height * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: 'auto',
    backgroundColor: 'white',
    marginVertical: RFPercentage(10),
    padding: RFPercentage(1),
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {

    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },

});

export default HomeAiScreen;
