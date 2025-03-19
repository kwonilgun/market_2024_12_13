/*
 * File: THomeNavigator.tsx
 * Project: rootone0216
 * File Created: Tuesday, 2024-02-20
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 */

import {StackNavigationProp} from '@react-navigation/stack';
import { IProduct } from '../interface/IProductInfo';
import { RouteProp } from '@react-navigation/native';
import { IProducerInfo } from '../interface/IAuthInfo';

export type EditStackParamList = {
  EditManager: {screen: 'EditMainScreen'};
  EditMainScreen: undefined;
  EditProductScreen: {item: IProduct}
  EditProducerScreen: {item: IProducerInfo}
  AddProductScreen: undefined;
  AddProducerScreen: undefined;
};

export type EditMainScreenProps = {
  navigation: StackNavigationProp<EditStackParamList, 'EditMainScreen'>;
};

export type EditProductScreenProps = {
  route: RouteProp<EditStackParamList, 'EditProductScreen'>;
  navigation: StackNavigationProp<EditStackParamList, 'EditProductScreen'>;
};
export type EditProducerScreenProps = {
  route: RouteProp<EditStackParamList, 'EditProducerScreen'>;
  navigation: StackNavigationProp<EditStackParamList, 'EditProducerScreen'>;
};

export type AddProductScreenProps = {
  navigation: StackNavigationProp<EditStackParamList, 'AddProductScreen'>;
};

export type AddProducerScreenProps = {
  navigation: StackNavigationProp<EditStackParamList, 'AddProducerScreen'>;
};
