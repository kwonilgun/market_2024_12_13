/*
 * File: ProductCard.tsx
 * Project: my-app
 * File Created: Saturday, 28th January 2023 2:56:54 pm
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * -----
 * Last Modified: Thursday, 2nd February 2023 1:19:24 pm
 * Modified By: Kwonilgun(권일근) (kwonilgun@naver.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2023 루트원 AI, 루트원 AI
 * -----
 * 2023-02-02 : CachedImage를 추가했다. image caching 을 구현했다.
 * 2023-05-03 : FastImage 수정: 웹 서버를 통해서 S3에 있는 이미지 파일을 가져온다. public에서 가져오는 것이 아니고 웹 서버를 통해서 이미지를 가져온다.
 * 2024-12-20 : package market로 변경
 */

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
// import {baseURL} from '../../assets/common/baseUrl';
import {baseURL} from '../../assets/common/BaseUrl';
import isEmpty from '../../utils/isEmpty';
import * as actions from '../../Redux/Cart/Actions/cartActions';
import {IProduct} from '../model/interface/IProductInfo';
import {height, width} from '../../assets/common/BaseValue';
import {StackNavigationProp} from '@react-navigation/stack';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {CartItem} from '../../Redux/Cart/Reducers/cartItems';

type ProductCardProps = {
  items: IProduct;
  navigation: StackNavigationProp<any, any>; // Update types based on your navigation stack
  addItemToCart: (cart: CartItem) => void;
};

const ProductCard: React.FC<ProductCardProps> = props => {
  //   const {name, price, image, discount} = props;

  const imageName = props.items.image!.split('/').pop() || '';

  return (
    <View style={styles.cardContainer}>
      <FastImage
        style={styles.image}
        source={{
          uri: imageName
            ? `${baseURL}products/downloadimage/${imageName}`
            : undefined,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      {showPriceInform(
        5,
        props.items.name,
        Number(props.items.discount),
        Number(props.items.price),
      )}
    </View>
  );
};

const mapDispatchToProps = (props: any, dispatch: any) => {
  return {
    addItemToCart: () =>
      dispatch(actions.addToCart({quantity: 1, product: props.items})),
  };
};

export default connect(null, mapDispatchToProps)(ProductCard);

export function showPriceInform(
  marginLeft: number,
  name: string,
  discount?: number,
  price?: number,
) {
  return (
    <View style={[styles.infoContainer, {marginLeft}]}>
      <Text style={styles.productName}>
        {name.length > 15 ? name.substring(0, 12) + '...' : name}
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.discountText}>
          {discount ? `${discount}% ` : ''}
        </Text>

        {!isEmpty(discount) ? (
          <Text style={styles.strikeThroughText}>
            {price?.toLocaleString('kr-KR')}원
          </Text>
        ) : (
          <Text style={styles.normalPriceText}>
            {price?.toLocaleString('kr-KR')}원
          </Text>
        )}
      </View>

      {!isEmpty(discount) ? (
        <Text style={styles.finalPriceText}>
          {((price || 0) * (100 - (discount || 0)) * 0.01).toLocaleString(
            'kr-KR',
          )}{' '}
          원
        </Text>
      ) : null}

      <Text style={styles.freeShippingText}>무료배송</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: RFPercentage(30),
    width: width * 0.9,
    borderWidth: 1,
    borderColor: 'green',
    padding: 4,
    borderRadius: 10,
    marginBottom: RFPercentage(1),
    flexDirection: 'column',
  },
  image: {
    width: RFPercentage(40),
    height: RFPercentage(20),
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 4,
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    color: 'red',
    fontSize: 14,
  },
  strikeThroughText: {
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  normalPriceText: {
    fontSize: 14,
  },
  finalPriceText: {
    fontSize: 14,
  },
  freeShippingText: {
    fontSize: 10,
  },
});
