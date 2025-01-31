/*
 * File: THomeNavigator.tsx
 * Project: rootone0216
 * File Created: Tuesday, 2024-02-20
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 */

import {StackNavigationProp} from '@react-navigation/stack';

export type AdminOrderStackParamList = {
  // EditManager: {screen: 'EditMainScreen'};
  AdminOrderMainScreen: undefined;
  // EditProductScreen: {item: IProduct}
  OrderStatusScreen: undefined;
  OrderRxScreen: undefined;
};

export type AdminOrderMainScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'AdminOrderMainScreen'>;
};

export type OrderStatusScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'OrderStatusScreen'>;
};

export type OrderRxScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'OrderRxScreen'>;
};