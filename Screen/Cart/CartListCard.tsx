/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useRef} from 'react';
import {CartItem} from '../../Redux/Cart/Reducers/cartItems';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as actions from '../../Redux/Cart/Actions/cartActions';
import FastImage from 'react-native-fast-image';
import {height, width} from '../../assets/common/BaseValue';
import {showPriceInform} from './showPriceInform';
import {baseURL} from '../../assets/common/BaseUrl';
import {
  confirmAlert,
  ConfirmAlertParams,
} from '../../utils/alerts/confirmAlert';
import {IProduct} from '../model/interface/IProductInfo';
import {connect} from 'react-redux';
import strings from '../../constants/lang';

interface CartListCardProps {
  item: CartItem;
  //   totalFt: (sum: number) => void;
  //   cart: CartItem[];
  changeQuantity: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
}

const CartListCard: React.FC<CartListCardProps> = props => {
  const {item} = props;

  const refNumber = useRef<number>(item.quantity);
  const imageName = item.product.image?.split('/').pop();

  useEffect(() => {
    console.log(`CartListCard.tsx: 진입: refNumber = ${refNumber.current}`);
    // cartItems가 배열이 아니거나 undefined일 경우 기본값 설정

    console.log('props.cartItems = ', props.cart);

    let sum = 0;
    if (Array.isArray(props.cart)) {
      props.cart.forEach(item => {
        sum += Number(item.product.price) * item.quantity;
      });
    } else {
      console.log('CartListCard: useEffect: Array가 아니다.');
    }

    console.log(`CartListCard.tsx: number 총계 = ${sum}`);
  }, [props.cart, item]);

  const incNum = () => {
    if (refNumber.current < 20) {
      props.changeQuantity({
        product: item.product,
        quantity: refNumber.current + 1,
      });
      refNumber.current += 1;
    }
  };

  const decNum = () => {
    if (refNumber.current > 1) {
      props.changeQuantity({
        product: item.product,
        quantity: refNumber.current - 1,
      });
      refNumber.current -= 1;
    }
  };

  const deleteCartOrder = () => {
    props.removeFromCart(item);
  };

  return (
    <View style={styles.cardContainer}>
      <FastImage
        style={{
          width: width * 0.28,
          height: height * 0.15,
          borderRadius: 10,
        }}
        source={{
          uri: imageName
            ? `${baseURL}products/downloadimage/${imageName}`
            : undefined,

          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      {showPriceInform(
        4,
        item.product.name,
        item.product.discount!,
        item.product.price!,
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.priceText}>
          가격:{' '}
          {(
            Number(item.product.price) *
            (100 - Number(item.product.discount || 0)) *
            0.01 *
            refNumber.current
          ).toLocaleString('ko-KR')}
          원
        </Text>

        <View style={styles.quantityContainer}>
          <Button title="-" onPress={decNum} />
          <Text style={styles.quantityText}>{refNumber.current}</Text>
          <Button title="+" onPress={incNum} />
        </View>

        <TouchableOpacity
          onPress={() => {
            const param: ConfirmAlertParams = {
              title: strings.CONFIRMATION,
              message: strings.DELETE_SHOPPING_CART,

              func: () => {
                console.log('장바구니 삭제 실행.... ');
                // onPressStart();
                deleteCartOrder(); // 상태 변경
              },
              params: [],
            };
            confirmAlert(param);
          }}>
          <Text style={styles.trashIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: width * 0.28,
    height: height * 0.15,
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 16,
  },
  quantityContainer: {
    marginTop: 4,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 4,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  trashIcon: {
    color: 'blue',
    fontSize: 20,
  },
});

const mapStateToProps = (state: CartItem[]) => {
  return state;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    removeFromCart: (item: CartItem) => dispatch(actions.removeFromCart(item)),
    changeQuantity: (item: CartItem) => dispatch(actions.changeQuantity(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartListCard);
