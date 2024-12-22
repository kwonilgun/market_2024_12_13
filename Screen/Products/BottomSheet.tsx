import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {Modalize} from 'react-native-modalize';
// import { LOG } from '../../Log/reactLogger';
import {connect} from 'react-redux';
import * as actions from '../../Redux/Cart/Actions/cartActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {height} from '../../assets/common/BaseValue';
import GlobalStyles from '../../styles/GlobalStyles';
import strings from '../../constants/lang';
import {IProduct} from '../model/interface/IProductInfo';
import {CartItem} from '../../Redux/Cart/Reducers/cartItems';

type Props = {
  modalRef: React.RefObject<Modalize>;
  item: IProduct;
  dProps: {
    navigation: {
      goBack: () => void;
      navigate: (screen: string, params?: object) => void;
    };
  };
  addItemToCart: (number: number, product: IProduct) => void;
  clearCart: () => void;
  removeFromCart: (item: CartItem) => void;
  changeQuantity: (item: CartItem) => void;
};

const BottomSheet: React.FC<Props> = props => {
  const {modalRef, item, dProps} = props;
  const refNumber = useRef<number>(1);
  const [buyNumber, setBuyNumber] = useState<number>(1);

  useEffect(() => {
    refNumber.current = 1;
  }, []);

  const putInShoppingCart = (
    dProps: Props['dProps'],
    number: number,
    item: Props['item'],
  ) => {
    console.log('putInShoppingCart number, item', number, item);
    props.addItemToCart(number, item);
    //     dProps.navigation.goBack();
    dProps.navigation.navigate('ShoppingCart', {screen: 'CartMainMenu'});
    modalRef.current?.close();
  };

  const buyItRightAway = async (
    dProps: Props['dProps'],
    number: number,
    item: Props['item'],
  ) => {
    props.addItemToCart(number, item);
    dProps.navigation.goBack();

    const resDelivery = {
      name: null,
      address1: null,
      address2: null,
      phone: null,
      deliveryMethod: null,
      deliveryId: null,
      checkMark: false,
    };

    //2024-12-21 :나중에 데이터를 가져올 때는 JSON.parse를 사용하여 다시 객체로 변환해야 합니다:
    await AsyncStorage.setItem('deliveryInfo', JSON.stringify(resDelivery));

    //     dProps.navigation.navigate('PaymentNavigator', {
    //       screen: 'Shipping Information',
    //     });
  };

  const incNum = () => {
    if (refNumber.current < 20) {
      props.changeQuantity({product: item, quantity: refNumber.current + 1});
      refNumber.current += 1;
      setBuyNumber(refNumber.current);
    }
  };

  const decNum = () => {
    if (refNumber.current > 1) {
      props.changeQuantity({product: item, quantity: refNumber.current - 1});
      refNumber.current -= 1;
      setBuyNumber(refNumber.current);
    }
  };

  return (
    <Modalize
      ref={modalRef}
      snapPoint={height * 0.4}
      adjustToContentHeight={true}>
      <View style={styles.container}>
        <Text style={styles.brandText}>브랜드: {item.brand}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            가격:{' '}
            {(
              Number(item.price) *
              (100 - Number(item.discount ? item.discount : 0)) *
              refNumber.current *
              0.01
            ).toLocaleString('kr-KR')}
            원
          </Text>

          <Text>갯수:</Text>

          <View style={styles.quantityContainer}>
            <Button title="-" onPress={decNum} color="indigo" />
            <Text style={styles.quantityText}>{buyNumber}</Text>
            <Button title="+" onPress={incNum} color="indigo" />
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log('BottomSheet: 장바구니 담기 누름');
              putInShoppingCart(dProps, refNumber.current, item);
            }}>
            {/* {badgeStyle('장바구니 담기', null)} */}
            <View style={GlobalStyles.buttonSmall}>
              <Text style={GlobalStyles.buttonTextStyle}>
                {strings.ADD_TO_CART}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('BottomSheet: 바로 구매하기 버튼 누름');
              buyItRightAway(dProps, refNumber.current, item);
            }}>
            {/* {badgeStyle('바로구매', null)} */}
            <View style={GlobalStyles.buttonSmall}>
              <Text style={GlobalStyles.buttonTextStyle}>
                {strings.BUY_NOW}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('BottomSheet: 취소 버튼 누름');
              modalRef.current?.close();
            }}>
            {/* {badgeStyle('취소', null)} */}
            <View style={GlobalStyles.buttonSmall}>
              <Text style={GlobalStyles.buttonTextStyle}>{strings.CANCEL}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 10,
  },
  brandText: {
    padding: 10,
    fontSize: 18,
  },
  priceContainer: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
  },
  priceText: {
    fontSize: 18,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  quantityText: {
    marginHorizontal: 10,
  },
  actionContainer: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    addItemToCart: (number: number, product: any) =>
      dispatch(actions.addToCart({quantity: number, product})),
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item: any) => dispatch(actions.removeFromCart(item)),
    changeQuantity: (item: CartItem) => dispatch(actions.changeQuantity(item)),
  };
};

const mapStateToProps = (state: any) => {
  const {cartItems} = state;
  return {
    cartItems,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomSheet);
