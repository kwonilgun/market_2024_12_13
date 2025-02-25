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
  PaymentCompleteScreen: undefined;
  OrderDetailScreen: undefined;
  PrepareDeliveryScreen: undefined;
  FindOrderNumberScreen: undefined;
  OrderAIScreen: undefined;
  DuringDeliveryScreen: undefined;
  CompleteDeliveryScreen: undefined;
  RequestReturnScreen: undefined;
  CompleteReturnScreen: undefined;
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

export type PaymentCompleteScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'PaymentCompleteScreen'>;
};

export type OrderDetailScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'OrderDetailScreen'>;
};

export type PrepareDeliveryScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'PrepareDeliveryScreen'>;
};

export type FindOrderNumberScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'FindOrderNumberScreen'>;
};

export type OrderAIScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'OrderAIScreen'>;
};

export type DuringDeliveryScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'DuringDeliveryScreen'>;
};

export type CompleteDeliveryScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'CompleteDeliveryScreen'>;
};

export type RequestReturnScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'RequestReturnScreen'>;
};
export type CompleteReturnScreenProps = {
  navigation: StackNavigationProp<AdminOrderStackParamList, 'CompleteReturnScreen'>;
};