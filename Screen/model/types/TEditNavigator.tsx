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
// import {RouteProp} from '@react-navigation/native';
// import {IProduct} from '../interface/IProductInfo';

export type EditStackParamList = {
  EditManager: {screen: 'EditMainScreen'};
  EditMainScreen: undefined;
  EditProductScreen: {item: IProduct}
  AddProductScreen: undefined;
};

export type EditMainScreenProps = {
  navigation: StackNavigationProp<EditStackParamList, 'EditMainScreen'>;
};

export type EditProductScreenProps = {
  route: RouteProp<EditStackParamList, 'EditProductScreen'>;
  navigation: StackNavigationProp<EditStackParamList, 'EditProductScreen'>;
};

export type AddProductScreenProps = {
  navigation: StackNavigationProp<EditStackParamList, 'AddProductScreen'>;
};
