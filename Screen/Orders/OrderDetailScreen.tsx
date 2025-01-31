/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RFPercentage } from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import isEmpty from '../../utils/isEmpty';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import { OrderDetailScreenProps } from '../model/types/TUserNavigator';
import { IOrderInfo } from '../model/interface/IOrderInfo';
import GlobalStyles from '../../styles/GlobalStyles';
import { dateToKoreaTime } from '../../utils/time/dateToKoreaTime';
import { getToken } from '../../utils/getSaveToken';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../../assets/common/BaseUrl';
import { IOrderItem } from '../model/interface/IOrderItem';
import {
  confirmAlert,
  ConfirmAlertParams,
} from '../../utils/alerts/confirmAlert';
import strings from '../../constants/lang';
import { useAuth } from '../../context/store/Context.Manager';
import DropDownPicker from 'react-native-dropdown-picker';
import { SubmitHandler, useForm } from 'react-hook-form';
import { alertMsg } from '../../utils/alerts/alertMsg';
import { errorAlert } from '../../utils/alerts/errorAlert';

type IOrderStatus = {
  status: number|null,
};

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = props => {
  const {state} = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [item] = useState<IOrderInfo>(props.route.params?.item);
  const [orderItem, setOrderItem] = useState<IOrderItem | null>(null);
  const [total, setTotal] = useState<Number>(0);

  const [openMethod, setOpenMethod] = useState<boolean>(false);
  const [valueMethod, setValueMethod] = useState<number>(Number(props.route.params?.item.status));
  const [itemsMethod, setItemsMethod] = useState([
      {label: '주문 접수', value: 1},
      {label: '결재 완료', value: 2},
      {label: '배송 준비', value: 3},
      {label: '배송중', value: 4},
      {label: '배송 완료', value: 5},
      {label: '반품 요청', value: 6},
      {label: '반품 완료', value: 7},
    ]);

  const isAdmin = state.user?.isAdmin;
  console.log('item = ', props.route.params?.item);


  const {
      control,
      setValue,
      getValues,
      handleSubmit,
      formState: {errors},
      reset,
    } = useForm<IOrderStatus>({
      defaultValues: {
       status: Number(props.route.params?.item.status),
      },
    });

  useEffect(() => {
    if (!isEmpty(props.route.params.item)) {
      console.log('');
      fetchOrderItemFromAWS();
      setLoading(false);
    }
    return () => {
      console.log('OrderLists: useEffect : exit 한다.');
      setLoading(true);
    };
  }, [props.route.params.item]);

  const fetchOrderItemFromAWS = async () => {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const orderItemNumber = item.orderItems;
    console.log('OrderDetail orderItemNumber ', orderItemNumber);

    try {
      const response: AxiosResponse = await axios.get(
        `${baseURL}orders/orderItems/${orderItemNumber}`,
        config,
      );
      if (response.status === 200) {
        setOrderItem(response.data);

        //   setBrand(res.data.product.brand);
        //   setQuantity(res.data.quantity);
        //   setPrice(res.data.product.price);
        //   setDiscount(res.data.product.discount);
        setTotal(
          Number(response.data.product.price) *
            (100 - Number(response.data.product.discount)) *
            0.01 *
            response.data.quantity,
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            // transform: [{scaleX: 1.5}], // 폭을 1.5배 넓힘
          }}
          name="arrow-left"
        />
      </TouchableOpacity>
    );
  };

  const deleteOrderItem = async () => {
    console.log('OrderedDetail.jsx: 삭제 누름');

    const param: ConfirmAlertParams = {
      title: strings.CONFIRMATION,
      message: '주문을  삭제하시겠습니까?',
      func: props.route.params.actionFt,
      params: [item.id, props],
    };

    confirmAlert(param);
  };
  
  const confirmUpload: SubmitHandler<IOrderStatus> = async data => {
    console.log('업로드 order status = ', data);

    const param: ConfirmAlertParams = {
      title: strings.CONFIRMATION,
      message: '주문상태 변경',
      func: async (in_data: IOrderStatus) => {
        console.log('주문상태 업로드 data = ', in_data);
        const status: IOrderStatus = in_data;

        const token = await getToken();
       
        const config = {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${token}`,
          },
        };
        try {
          const response: AxiosResponse = await axios.put(
            `${baseURL}orders/status/${item.id}`,
            JSON.stringify(status),
            config,
          );
          if (response.status === 200 || response.status === 201) {
            alertMsg(strings.SUCCESS, strings.UPLOAD_SUCCESS);
          } else if (response.status === 202) {
            alertMsg('에러', '주문상태 202');
          } else if (response.status === 203) {
            alertMsg('에러', '주문 ');
          }
        } catch (error) {
          console.log('confirmUpload error, error = ', error);
          alertMsg(strings.ERROR, strings.UPLOAD_FAIL);
        }
      },
      params: [data],
    };

    confirmAlert(param);
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText="주문 상세"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />
      <>
        {loading ? (
          <LoadingWheel />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={GlobalStyles.containerKey}>
            <ScrollView
              style={GlobalStyles.scrollView}
              keyboardShouldPersistTaps="handled">
              <View style={GlobalStyles.VStack}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: RFPercentage(0.2),
                    alignContent: 'center',
                    alignItems: 'center',
                  }} >
                    {isAdmin && (
                      <TouchableOpacity onPress={() => {

                          if(Number(props.route.params?.item.status) !== getValues('status')){
                            handleSubmit(confirmUpload)();
                          }
                          else{
                            errorAlert('에러', '주문상태 변경 안됨');
                          }

                          }

                          }>
                          <View style={GlobalStyles.buttonSmall}>
                          <Text style={GlobalStyles.buttonTextStyle}>
                          업데이트
                          </Text>
                          </View>
                          </TouchableOpacity>
                    )}

                  {props.route.params.actionFt === null ? null : (
                    <View style={styles.actionContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          deleteOrderItem();
                        }}>
                        <View style={GlobalStyles.buttonSmall}>
                          <Text style={GlobalStyles.buttonTextStyle}>삭제</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                )}
                </View>


                <View style={styles.orderContainer}>
                  <Text style={styles.heading}>주문 정보</Text>

                  {/* <View style={styles.row}>
                    <Text style={styles.label}>주문 상태:</Text>
                    <Text style={styles.valueError}>{orderMsg}</Text>
                  </View> */}

                  <View style={styles.row}>
                    <Text style={styles.label}>상품 브랜드:</Text>
                    <Text style={styles.value}>{orderItem?.product.brand}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>주문 번호:</Text>
                    <Text style={styles.value}>{item.orderNumber}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>주문 시간:</Text>
                    <Text style={styles.value}>
                      {dateToKoreaTime(new Date(item.dateOrdered))}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>주문 수량(개):</Text>
                    <Text style={styles.value}>{orderItem?.quantity}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>상품 가격(원):</Text>
                    <Text style={styles.value}>
                      {orderItem?.product.price?.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>할인율(%):</Text>
                    <Text style={styles.value}>
                      {orderItem?.product.discount}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>총 금액(원):</Text>
                    <Text style={styles.value}>{total?.toLocaleString()}</Text>
                  </View>

                  <Text style={styles.label}>받는사람(전화번호):</Text>
                  <Text style={styles.value}>
                    {item.receiverName} : {item.receiverPhone}
                  </Text>

                  <Text style={styles.label}>받는사람 주소:</Text>
                  <Text style={styles.value}>{item.address1}</Text>
                  <Text style={styles.value}>{item.address2}</Text>

                  <Text style={styles.label}>구매자:</Text>
                  <Text style={styles.value}>
                    {item.buyerName} : {item.buyerPhone}
                  </Text>
                </View>

{/* 2025-01-31 11:34:25: isAdmin 이면 상태 변경을 허용한다. */}
              {isAdmin && (
                <View style={{flex: 0.8}}>
                <Text style={GlobalStyles.inputTitle}>주문 상태 변경</Text>
                <View style={styles.HCStack}>
                  <DropDownPicker
                    style={{backgroundColor: 'gainsboro'}}
                    listMode="MODAL"
                    open={openMethod}
                    value={valueMethod}
                    items={itemsMethod}
                    setOpen={setOpenMethod}
                    setValue={setValueMethod}
                    setItems={setItemsMethod}
                    onChangeValue={value => {
                      console.log('act value', value);
                      setValue('status', value);
                      // setValue('deliveryMethod', Number(value));
                    }} // 값이 바뀔 때마다 실행
                    listItemContainerStyle={{
                      margin: RFPercentage(2),
                      backgroundColor: 'gainsboro',
                    }}
                  />
                </View>
              </View>
              )}

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  HCStack: {
      margin: RFPercentage(0.2),
      // padding: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  actionContainer: {
     marginVertical: RFPercentage(1),
    // padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderContainer: {
    margin: RFPercentage(0.2),
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontWeight: '600',
    width: 120,
  },
  value: {
    flex: 1,
    paddingLeft: 10,
  },
  valueError: {
    color: 'red',
    paddingLeft: 10,
  },
});
export default OrderDetailScreen;
