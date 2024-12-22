/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet, Text, View} from 'react-native';
import isEmpty from '../../utils/isEmpty';

export function showPriceInform(
  marginLeft: number,
  name: string,
  discount: string,
  price: string,
) {
  return (
    <View style={[styles.priceInfoContainer, {marginLeft}]}>
      <Text style={styles.productName}>
        {name.length > 15 ? name.substring(0, 12) + '...' : name}
      </Text>
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>
          {discount ? `${discount}% ` : ''}
        </Text>
        {!isEmpty(discount) ? (
          <Text style={styles.strikethroughPrice}>
            {Number(price).toLocaleString('kr-KR')}원
          </Text>
        ) : (
          <Text style={styles.priceText}>
            {Number(price).toLocaleString('kr-KR')}원
          </Text>
        )}
      </View>
      {!isEmpty(discount) ? (
        <Text style={styles.finalPriceText}>
          {(
            Number(price) *
            (100 - Number(discount ? discount : 0)) *
            0.01
          ).toLocaleString('kr-KR')}{' '}
          원
        </Text>
      ) : null}
      <View style={styles.freeShippingContainer}>
        <Text style={styles.freeShippingText}>무료배송</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    color: 'red',
    fontSize: 12,
  },
  strikethroughPrice: {
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  priceText: {
    fontSize: 12,
  },
  finalPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  freeShippingContainer: {
    marginTop: 5,
  },
  freeShippingText: {
    fontSize: 10,
    color: 'gray',
  },
});
