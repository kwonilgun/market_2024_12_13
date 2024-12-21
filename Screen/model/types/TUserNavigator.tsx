/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * File: TNavigator.tsx
 * Project: root_project
 * File Created: Thursday, 15th February 2024
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 */

import {StackNavigationProp} from '@react-navigation/stack';
import {IAuthInfo} from '../interface/IAuthInfo';
import {RouteProp} from '@react-navigation/native';
import {UserFormInput} from '../interface/IAuthInfo';
import {IOrderInfo} from '../../../Order/interface/IOrderInfo';
import {IPlasmaSetting} from '../../../Wifi/SettingScreen';
import {INotification} from '../../../Chat/chatManager';
import {
  INotify,
  IPushNotify,
} from '../../../Notification/PushNotificationScreen';
import {IProduct} from '../interface/IProductInfo';
import {ICompany} from '../interface/ICompany';

export type RootStackParamList = {
  AdminScreen: undefined;
  EditUsageTermScreen: undefined;
  EditPrivatePolicyScreen: undefined;
  LoginScreen: undefined;
  PasswordResetScreen: undefined;
  ChangePasswordScreen: undefined;
  ProfileScreen: {userInfo: UserFormInput};
  AuthorizeScreen: {authInfo: IAuthInfo};
  OrderListsScreen: {orderInfo: IOrderInfo[]};
  OrderDetailScreen: {detailInfo: IOrderInfo};
  SystemInfoScreen: undefined;
  MembershipUsageTermScreen: undefined;
  UsageTermScreen: undefined;
  MembershipPrivacyPolicyScreen: undefined;
  PrivacyPolicyScreen: undefined;
  MembershipScreen: undefined;
  ProductMainScreen: undefined;
  ProductDetailScreen: undefined;
  CartMainScreen: undefined;
};

// 2024-11-16 : Admin 추가
export type AdminScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AdminScreen'>;
};

export type PasswordResetScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'PasswordResetScreen'>;
};

export type EditUsageTermScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditUsageTermScreen'>;
};

export type EditPrivatePolicyScreenProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    'EditPrivatePolicyScreen'
  >;
};

export type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
};

export type ChangePasswordScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ChangePasswordScreen'>;
};

export type SystemInfoScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SystemInfoScreen'>;
};

export type MembershipUsageTermScreenProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    'MembershipUsageTermScreen'
  >;
};

export type UsageTermScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UsageTermScreen'>;
};

export type MembershipPrivacyPolicyScreenProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    'MembershipPrivacyPolicyScreen'
  >;
};

export type PrivacyPolicyScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'PrivacyPolicyScreen'>;
};

export type AuthorizeScreenProps = {
  route: RouteProp<RootStackParamList, 'AuthorizeScreen'>;
};

export type MembershipScreenProps = {
  route: RouteProp<RootStackParamList, 'MembershipScreen'>;
};

export type ProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'ProfileScreen'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>;
};

export type OrderListsScreenProps = {
  route: RouteProp<RootStackParamList, 'OrderListsScreen'>;
  navigation: StackNavigationProp<RootStackParamList, 'OrderListsScreen'>;
};

export type OrderDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'OrderDetailScreen'>;
  navigation: StackNavigationProp<RootStackParamList, 'OrderDetailScreen'>;
};

export type ProductMainScreenProps = {
  navigation: any;
  route: RouteProp<RootStackParamList, 'ProductMainScreen'>;
};

export type ProductDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetailScreen'>;
  route: {
    params: {
      item: IProduct;
      companyInform: ICompany;
    };
  };
  // items: IProduct;
  // companyInform: ICompany;
  addItemToCart: (product: {quantity: number; product: IProduct}) => void;
  // cartItems: any[];
};

export type CartMainScreenProps = {
  navigation: any;
  route: RouteProp<RootStackParamList, 'ProductMainScreen'>;
};
