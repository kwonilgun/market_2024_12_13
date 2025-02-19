/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import strings from '../../constants/lang';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/store/Context.Manager';
import GlobalStyles from '../../styles/GlobalStyles';
import { CartItem } from '../../Redux/Cart/Reducers/cartItems';
import { connect } from 'react-redux';
import { IDeliveryInfo } from '../model/interface/IDeliveryInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from '../../utils/isEmpty';
import { ScrollView } from 'react-native-gesture-handler';
import { returnDashNumber } from '../../utils/insertDashNumber';
import deliveries from '../../assets/json/deliveries.json';
import { width } from '../../styles/responsiveSize';
import { getToken } from '../../utils/getSaveToken';
import { jwtDecode } from 'jwt-decode';
import { IUserAtDB, UserFormInput } from '../model/interface/IAuthInfo';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../../assets/common/BaseUrl';
import TransferSheet from './TransferSheet';
import { Modalize } from 'react-native-modalize';
import * as actions from '../../Redux/Cart/Actions/cartActions';
import moment from 'moment';
import {
  confirmAlert,
  ConfirmAlertParams,
} from '../../utils/alerts/confirmAlert';
import { alertMsg } from '../../utils/alerts/alertMsg';
import { PaymentMainScreenProps } from '../model/types/TPaymentNavigator';
import { PAYMENT_COMPLETE } from '../../assets/common/BaseValue';

const PaymentMainScreen: React.FC<PaymentMainScreenProps> = props => {
  const {state, dispatch} = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [totalPayment, setTotalPayment] = useState<number | undefined>();
  const [deliveryList, setDeliveryList] = useState<IDeliveryInfo[]>([]);
  const [buyer, setBuyer] = useState<IUserAtDB>();
  const [cart, setCart] = useState<CartItem>();
  const [transMoney, setTransMoney] = useState<string>('');
  const modalRef = useRef<Modalize>(null);

  useFocusEffect(
    useCallback(() => {
      console.log('ShippingMainScreen useCallback cart=', props.cart);
      if (state.isAuthenticated) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
        setLoading(false);
        return;
      }

      getDeliveryList();
      fetchBuyerInform();

      return () => {
        setLoading(true);
      };
    }, [state, props.cart]),
  );

  const getDeliveryList = async () => {
    const tmp = await AsyncStorage.getItem('deliveryList');
    const deliveryList: IDeliveryInfo[] = JSON.parse(tmp!) as IDeliveryInfo[];

    let sum = 0;

    if (!isEmpty(deliveryList)) {
      props.cart.forEach(item => {
        sum += Number(item.product.price) * item.quantity;
      });

      console.log('PaymentMainScreen sum = ', sum);

      setTotalPayment(sum);
      setDeliveryList(deliveryList);
    }
  };

  const fetchBuyerInform = async () => {
    const token = await getToken();
    const decoded = jwtDecode(token!) as UserFormInput;
    const userId = decoded.userId;
    console.log('fetchBuyerInform userId = ', userId);
    //     const config = {
    //       headers: {
    //         'Content-Type': 'application/json; charset=utf-8',
    //         Authorization: `Bearer ${token}`,
    //       },
    //     };
    const response: AxiosResponse = await axios.get(
      `${baseURL}users/${userId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    if (response.status === 200) {
      console.log('PaymentMainScreen 사는 사람 정보 = ', response.data);
      setBuyer(response.data);
    }
  };

  const generateOrderNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(4, '0');

    return `${year}${month}${day}-${randomNum}`;
  };

  const finishOrder = async (item: CartItem) => {
    console.log('finishOrder item  = ', item);

    const m_uid: string = generateOrderNumber();
    const cartArray: CartItem[] = [item];
    const param: ConfirmAlertParams = {
      title: '송금을 완료하셨습니까?',
      message: '주문이 접수됩니다.  온라인 계좌로 송금을 해 주세요',
      func: async (cartArray: CartItem[]) => {
        const orderLists = Promise.all(
          deliveryList.map(async element => {
            const order = {
              ...element,
              orderItems: cartArray,
              orderNumber: m_uid,
              isPaid: false,
              user: state.user?.userId,
              buyerName: buyer?.nickName,
              buyerPhone: buyer?.phone,
              status: PAYMENT_COMPLETE,
              // dateOrdered: moment().format(),
              dateOrdered: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('.')[0],
            };

            try {
              const data: AxiosResponse = await axios.post(
                `${baseURL}orders`,
                order,
              );
              return data;

            } catch (error) {
              console.log('finishOrder error = ', error);
              // errorAlert('에러', '주문 요청 에러 발생');
              return null;
            }

          }),
        );

        const response = await orderLists;
        console.log(' PaymentMainScreen response = ', response);

        // Check if all responses have status 200
        const allSuccess = response?.every(res => res?.status === 200);

        if (allSuccess) {
          // Show success message
          alertMsg(
            strings.SUCCESS,
            '주문이 성공적으로 접수되었습니다!',
            // () => {
            //   props.navigation.navigate('UserMain', {screen: 'ProfileScreen'});
            // },
            // props,
          );

          // 2024-12-25 :주문이 성공적으로 진행이 되었기에 cart array를 삭제한다.
          // cartArray.map(item => props.removeFromCart(item));
          // 2025-02-02 20:16:23 - 해당되는 item 만을 삭제하도록 수정
          props.removeFromCart(item);
        } else {
          // Show error message
          alertMsg(
            strings.ERROR,
            '일부 주문이 실패했습니다. 다시 시도해 주세요.',
          );
        }
      },
      params: [cartArray],
    };

    confirmAlert(param);
  };

  const deliveryCard = (index: number, item: IDeliveryInfo) => {
    return (
      <View
        key={index}
        style={{
          marginTop: RFPercentage(1),
          padding: RFPercentage(1),
          borderTopColor: 'black',
          borderTopWidth: 1,
        }}>
        <Text style={[styles.text, styles.title]}>배송지 주소:</Text>

        <Text style={[styles.text, styles.name]}>{item.name}</Text>
        <Text style={[styles.text, styles.address]}>{item.address1}</Text>
        <Text style={[styles.text, styles.address]}>{item.address2}</Text>

        <Text style={styles.text}>{returnDashNumber(item.phone)}</Text>
        <Text style={styles.text}>{deliveries[item.deliveryMethod]?.name}</Text>
      </View>
    );
  };

  const onOpen = () => {
    console.log('confirm.jsx : onOpen');
    modalRef.current?.open();
  };

  const deleteCartOrder = (item: CartItem) => {
    props.removeFromCart(item);
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={strings.PAYMENT}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={false}
        isRight={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        {props.cart.length > 0 ? (
          <>
            <TransferSheet
              modalRef={modalRef}
              // onClose={onClose}
              item={cart!}
              transMoney={transMoney}
              dProps={props}
            />
            <ScrollView style={GlobalStyles.scrollView}>
              <View>
                <Text
                  style={{
                    margin: RFPercentage(2),
                    fontSize: RFPercentage(3),
                    fontWeight: 'bold',
                  }}>
                  주문 내역:
                </Text>

                {props.cart.map((item, index) => {
                  const amount =
                    Number(item.product.price) *
                    (100 - Number(item.product.discount || 0)) *
                    0.01 *
                    item.quantity *
                    deliveryList.length;

                  return (
                    <View
                      key={index}
                      style={{
                        width: width * 0.9,
                        margin: RFPercentage(2),
                        padding: RFPercentage(2),
                        borderColor: 'black',
                        borderWidth: 2,
                      }}>
                      <View style={styles.HStackHead}>
                        <Text style={{fontWeight: 'bold'}}>
                          상품: {item.product.brand || ''}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            const param: ConfirmAlertParams = {
                              title: strings.CONFIRMATION,
                              message: '주문을 삭제하시겠습니까?',

                              func: () => {
                                console.log('주문 삭제 실행.... ');
                                // onPressStart();
                                deleteCartOrder(item); // 상태 변경
                              },
                              params: [item],
                            };
                            confirmAlert(param);
                          }}>
                          <Text style={styles.trashIcon}>🗑️</Text>
                        </TouchableOpacity>
                      </View>

                      <Text>수량: {item.quantity * deliveryList.length}</Text>
                      <Text>송금할 금액: {amount}원</Text>
                      {deliveryList.map((item, index) =>
                        deliveryCard(index, item),
                      )}
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          margin: RFPercentage(1),
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setCart(item);
                            setTransMoney(String(amount));
                            onOpen();
                          }}>
                          <View style={GlobalStyles.buttonSmall}>
                            <Text style={GlobalStyles.buttonTextStyle}>
                              생산자 계좌
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            finishOrder(item);
                          }}>
                          <View style={GlobalStyles.buttonSmall}>
                            <Text style={GlobalStyles.buttonTextStyle}>
                              송금 완료
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>장바구니가 비었습니다.</Text>
            {/* <Button
            title="주문 확인"
            onPress={() => {
              LOG.info('Confirm.tsx : 주문 확인 버튼');
              props.navigation.navigate('User Main', 'User Profile');
            }}
          /> */}
          </View>
        )}
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  HStackHead: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  container: {
    marginTop: 8,
    paddingBottom: 8,
  },
  borderTop: {
    borderTopColor: 'black',
    borderTopWidth: 0.5,
  },
  text: {
    marginLeft: 8,
  },
  title: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
  },
  address: {
    fontSize: 14,
  },
  trashIcon: {
    color: 'blue',
    fontSize: 20,
  },
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item: CartItem) => dispatch(actions.removeFromCart(item)),
  };
};
const mapStateToProps = (state: CartItem) => {
  return state;
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMainScreen);
