/*
 * File: THomeNavigator.tsx
 * Project: rootone0216
 * File Created: Tuesday, 2024-02-20
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 */

import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {CartItem} from '../../../Redux/Cart/Reducers/cartItems';

export type ShippingStackParamList = {
  ShippingMainScreen: undefined;
  ShippingRegisterScreen: undefined;
};

export type ShippingMainScreenProps = {
  cart: CartItem[];
  route: RouteProp<ShippingStackParamList, 'ShippingMainScreen'>;
  navigation: StackNavigationProp<ShippingStackParamList, 'ShippingMainScreen'>;
};

export type ShippingRegisterScreenProps = {
  route: RouteProp<ShippingStackParamList, 'ShippingMainScreen'>;
  navigation: StackNavigationProp<ShippingStackParamList, 'ShippingMainScreen'>;
};
