/*
 * File: IAuthInfo.tsx
 * File Created: Thursday, 15th February 2024
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 */

// 사용자 정보에 대한 기본 정보
export interface IAuth {
  phoneNumber: string;
  nickName?: string;
  // 2024-12-23 : 추가
  name?: string;
  // 2024-05-05 : plasma id, iot 사물번호
  // ozsId?: string;
}

// export interface IDeliveryInfo extends IAuth {
//   address1: string;
//   address2?: string;
//   deliveryMethod: number;
//   checkMark: boolean;
// }

export interface IAuthResult {
  status: number;
  data: any; // Adjust the type based on the actual response data structure
}

// 서버에서 사용자 번호에 대한 인증 대한 데이타 타입
export interface IAuthInfo extends IAuth {
  status: number;
  message: string;
}

//인증된 이후의 사용자 정보 전달
export interface UserFormInput extends IAuth {
  userId?: string;
  isAdmin?: boolean;
  isProducer?: boolean;
  password?: string;
}

export interface IUserAtDB {
  bankName: string;
  bankNumber: string;
  dateCreated: Date;
  deliveryInforms: [{}];
  deviceId: string;
  deviceToken: string;
  email: string;
  id: string;
  isAdmin: boolean;
  isProducer: boolean;
  nickName: string;
  ozsId: string;
  phone: string;
  token: string;
}

//전화번호 인증 코드에 대한 데이타 타입
export interface IAuthVerify extends UserFormInput {
  verify: string;
}
