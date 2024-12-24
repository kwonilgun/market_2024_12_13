/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import {RFPercentage} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import strings from '../../constants/lang';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../context/store/Context.Manager';
import GlobalStyles from '../../styles/GlobalStyles';
import {CartItem} from '../../Redux/Cart/Reducers/cartItems';
import {connect} from 'react-redux';
import {ShippingMainScreenProps} from '../model/types/TShippingNavigator';
import {IDeliveryInfo} from '../model/interface/IDeliveryInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from '../../utils/isEmpty';
import {ScrollView} from 'react-native-gesture-handler';
import {returnDashNumber} from '../../utils/insertDashNumber';
import deliveries from '../../assets/json/deliveries.json';
import {width} from '../../styles/responsiveSize';
import {getToken} from '../../utils/getSaveToken';
import {jwtDecode} from 'jwt-decode';
import {IUserAtDB, UserFormInput} from '../model/interface/IAuthInfo';
import axios, {AxiosResponse} from 'axios';
import {baseURL} from '../../assets/common/BaseUrl';

const ShippingMainScreen: React.FC<ShippingMainScreenProps> = props => {
  const {state, dispatch} = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [totalPayment, setTotalPayment] = useState<number | undefined>();
  const [deliveryList, setDeliveryList] = useState<IDeliveryInfo[]>([]);
  const [buyer, setBuyer] = useState<IUserAtDB>();

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
      fetchProducerInform();

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

  const fetchProducerInform = async () => {
    const token = await getToken();
    const decoded = jwtDecode(token!) as UserFormInput;
    const userId = decoded.userId;
    const config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    };
    const response: AxiosResponse = await axios.get(
      `${baseURL}users/${userId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    if (response.status === 200) {
      console.log('PaymentMainScreen 구매자 정보 = ', response.data);
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
                    <Text style={{fontWeight: 'bold'}}>
                      상품: {item.product.brand || ''}
                    </Text>
                    <Text>수량: {item.quantity * deliveryList.length}</Text>
                    <Text>송금할 금액: {amount}원</Text>
                    {deliveryList.map((item, index) =>
                      deliveryCard(index, item),
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
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
});

const mapStateToProps = (state: CartItem) => {
  return state;
};

export default connect(mapStateToProps)(ShippingMainScreen);
