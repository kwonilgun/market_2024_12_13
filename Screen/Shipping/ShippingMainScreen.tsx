/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useRef, useState} from 'react';
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
import colors from '../../styles/colors';
import strings from '../../constants/lang';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../context/store/Context.Manager';
import GlobalStyles from '../../styles/GlobalStyles';
import {CartItem} from '../../Redux/Cart/Reducers/cartItems';
import {connect} from 'react-redux';
import {ShippingMainScreenProps} from '../model/types/TShippingNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '../../utils/getSaveToken';
import axios, {AxiosResponse} from 'axios';
import {baseURL} from '../../assets/common/BaseUrl';
import {alertMsg} from '../../utils/alerts/alertMsg';
import {IDeliveryInfo} from '../model/interface/IDeliveryInfo';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import {width} from '../../assets/common/BaseValue';

const ShippingMainScreen: React.FC<ShippingMainScreenProps> = props => {
  const {state, dispatch} = useAuth();

  const [deliveryList, setDeliveryList] = useState<IDeliveryInfo[]>([]);
  const [deliveryFiltered, setDeliveryFilter] = useState<IDeliveryInfo[]>([]);
  const [showUpDelivery, setShowUpDelivery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const rxInformArray = useRef<IDeliveryInfo>();

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
      if (props.cart.length > 0) {
        getShippingInformationFromServer();
      } else {
        setLoading(false);
      }

      return () => {
        setShowUpDelivery(false);
        setLoading(true);
      };
    }, [state.isAuthenticated, props.cart]),
  );

  const gotoShippingModify = async () => {
    console.log('ShippingMainScreen : gotoShippingModify....');

    const deliveryProfile = {
      name: '',
      address1: '',
      address2: '',
      phone: '',
      deliveryMethod: 0,
      deliveryId: '',
      checkMark: false,
    };

    await AsyncStorage.setItem('deliveryInfo', JSON.stringify(deliveryProfile));

    props.navigation.navigate('ShippingRegisterScreen');
  };

  const getShippingInformationFromServer = async () => {
    try {
      const token = await getToken();
      const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
      };

      const deliveryResponse: AxiosResponse = await axios.get(
        `${baseURL}delivery/${state.user.userId}`,
        config,
      );

      if (deliveryResponse.status === 200 || deliveryResponse.status === 201) {
        if (deliveryResponse.data.length === 0) {
          setDeliveryList([]);
        } else {
          rxInformArray.current = deliveryResponse.data;
          setDeliveryList(deliveryResponse.data);
          setDeliveryFilter(deliveryResponse.data);
          setShowUpDelivery(true);
        }
      } else if (deliveryResponse.status === 205) {
        console.log('Shipping.tsx: No delivery information found');
      } else {
        alertMsg('error', 'No delivery information found');
      }
    } catch (error) {
      //  alertMsg('error', '배송지 정보 가져오지 못함.');
      console.log('Shipping.tsx error ' + error);
      //  props.navigation.navigate('UserMain', {screen: 'LoginScreen'});
    } finally {
      setLoading(false);
    }
  };

  const searchList = (id: string) => {
    if (id === '') {
      setDeliveryFilter(deliveryList);
    }
    setDeliveryFilter(
      deliveryList.filter((i: {name: string}) =>
        i.name.toLowerCase().includes(id.toLowerCase()),
      ),
    );
  };

  const openList = () => setSearchFocus(true);

  const onBlur = () => setSearchFocus(false);

  const onAllChangeMark = () => {
    const newList = (searchFocus ? deliveryFiltered : deliveryList).map(
      (item: IDeliveryInfo) => ({...item, checkMark: !item.checkMark}),
    );
    setDeliveryList(newList);
  };

  const gotoHomeMenu = () => {
    props.navigation.navigate('Home', {screen: 'ProductMainScreen'});
  };

  function addressInfoItems(list: any[], setDeliveryList: React.Dispatch<any>) {
    return list.map((item, index) => (
      <DeliveryCard
        key={index}
        name={item.name}
        address1={item.address1}
        address2={item.address2}
        phone={item.phone}
        deliveryMethod={item.deliveryMethod}
        deliveryId={item.id}
        navigation={props.navigation}
        checkMark={item.checkMark}
        deliveryList={list}
        index={index}
        setDeliveryList={setDeliveryList}
      />
    ));
  }

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={strings.SHIPPING}
        containerStyle={{paddingHorizontal: 8}}
        isRightView={false}
        isLeftView={false}
        //    leftCustomView={LeftCustomComponent}
        //    rightText={''}
        //    rightTextStyle={{color: colors.lightBlue}}
        //    onPressRight={() => {}}

        //    rightCustomView={RightCustomComponent}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        {loading ? (
          <>
            <LoadingWheel />
          </>
        ) : (
          <>
            {!isLogin ? (
              <View style={{alignItems: 'center', marginTop: 10}}>
                <Text style={{marginBottom: RFPercentage(2)}}>
                  장바구니 선택은 로그인이 필요합니다.
                </Text>
                <View style={styles.loginView}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('CartMainScreen: 로그인 필요합니다. ');
                    }}>
                    <View style={GlobalStyles.buttonSmall}>
                      <Text style={GlobalStyles.buttonTextStyle}>
                        "로그인 필요합니다"
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : props.cart.length > 0 ? (
              <ScrollView style={GlobalStyles.scrollView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 10,
                  }}>
                  <TouchableOpacity onPress={gotoShippingModify}>
                    <View style={GlobalStyles.buttonSmall}>
                      <Text style={GlobalStyles.buttonTextStyle}>
                        주소 추가
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      //   nextButtonAction(deliveryList, props);
                    }}>
                    <View style={GlobalStyles.buttonSmall}>
                      <Text style={GlobalStyles.buttonTextStyle}>다음</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {deliveryLists(
                  showUpDelivery,
                  addressInfoItems,
                  searchFocus ? deliveryFiltered : deliveryList,
                  setDeliveryList,
                )}
              </ScrollView>
            ) : (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={{marginBottom: 10}}>Your cart is empty.</Text>
                {/* <Button title="Select Products" onPress={gotoHomeMenu} /> */}
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  loginView: {
    margin: RFPercentage(2),
    alignItems: 'flex-end',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    color: colors.white,
  },
});

const mapStateToProps = (state: CartItem) => {
  return state;
};

export default connect(mapStateToProps)(ShippingMainScreen);

function deliveryLists(
  showUpDelivery: boolean,
  addressInfoItems: (
    list: any[],
    setDeliveryList: React.Dispatch<any>,
  ) => JSX.Element[],
  list: any[],
  setDeliveryList: React.Dispatch<any>,
) {
  return (
    <ScrollView>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: width * 0.9,
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#E2E8F0',
          }}>
          {showUpDelivery ? (
            addressInfoItems(list, setDeliveryList)
          ) : (
            <View style={{alignItems: 'center', marginVertical: 20}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                배송지 주소 없음
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
