/*
 * File: branchByStatus.tsx
 * Project: market_2024_12_13
 * File Created: Thursday, 19th December 2024 9:29:34 am
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * -----
 * Last Modified: Thursday, 19th December 2024 9:31:44 am
 * Modified By: Kwonilgun(권일근) (kwonilgun@naver.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 * 2024-12-19 : 최초 생성
 */

/*
참조 사이트: https://stackoverflow.com/questions/77481263/jwtdecode-invalidtokenerror-invalid-token-specified-invalid-base64-for-part,
jwtDecode - InvalidTokenError: Invalid token specified: invalid base64 for part #2 (Property ‘atob’ doesn’t exist)], jwtDecode의 typescript에서 에러 발생 시 - Fix
*/

import React from 'react';
import 'core-js/stable/atob'; // <- polyfill here
import {jwtDecode} from 'jwt-decode';
import {
  confirmAlert,
  ConfirmAlertParams,
} from '../../utils/alerts/confirmAlert';
import {LoginScreenProps} from '../model/types/TUserNavigator';
import {saveToken} from '../../utils/getSaveToken';
import {IAuthInfo} from '../model/interface/IAuthInfo';
import {IAuthResult} from '../model/interface/IAuthInfo';
import {UserFormInput} from '../model/interface/IAuthInfo';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import isEmpty from '../../utils/isEmpty';
// import {uploadMacInfoToDB} from './uploadUserInfoToDB';
import {AuthAction} from '../../context/store/Auth.Login';
// import {isValidMacAddress} from '../../utils/checkMacAddress';
import strings from '../../constants/lang';

export const AuthStatus = {
  FIRST_DEVICE_LOGIN: 200,
  OTHER_DEVICE_LOGIN: 201,
  SAME_DEVICE_LOGIN: 202,
};

export const branchByStatus = async (
  navigation: LoginScreenProps,
  // element: IAuthInfo,
  element: IAuthResult,
  dispatch: React.Dispatch<AuthAction>,
): Promise<void> => {
  // 2023-05-17 : user 추가
  if (element.status === AuthStatus.FIRST_DEVICE_LOGIN) {
    // LOG.info('Auth.action.jsx:loginUser', '최초 디바이스');
    console.log(
      'Utils.tsx branchByStatus: FIRST_DEVICE_LOGIN : element = ',
      element,
    );
  }
  //다른 디바이스 로그인
  else if (element.status === AuthStatus.OTHER_DEVICE_LOGIN) {
    console.log(
      'Utils.tsx branchByStatus: OTHER_DEVICE_LOGIN : element =',
      element,
    );

    const params: IAuthInfo = {
      status: element.status,
      message: element.data.message,
      nickName: element.data.nickName,
      phoneNumber: element.data.phoneNumber,
    };

    const param: ConfirmAlertParams = {
      title: strings.USER_AUTH_REQUEST,
      message: element.data.message,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      func: ({navigation}: LoginScreenProps, element: IAuthInfo) => {
        console.log('param2 = ', element);
        navigation.navigate('AuthorizeScreen', {authInfo: params});
      },
      params: [navigation, element],
    };

    confirmAlert(param);
  }
  // 같은 디바이스 로그인
  else if (element.status === AuthStatus.SAME_DEVICE_LOGIN) {
    console.log('branchByStatus : SAME_DEVICE_LOGIN:  element = ', element);

    saveToken(element.data.token);

    try {
      // await initializeSettings();

      const decoded = jwtDecode(element.data.token) as UserFormInput;
      console.log('branchByStatus decoded = ', decoded);

      makeUserDataAndDispatch(decoded);

      // const macAddress = await AsyncStorage.getItem('macAddress');

      // if (isEmpty(decoded.ozsId)) {
      //   await handleEmptyOzsId(decoded, macAddress);
      // } else {
      //   await handleNonEmptyOzsId(decoded, macAddress);
      // }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  function makeUserDataAndDispatch(decoded: UserFormInput) {
    const userData: UserFormInput = {
      nickName: decoded.nickName,
      phoneNumber: decoded.phoneNumber,
      userId: decoded.userId === null || undefined ? '' : decoded.userId,
    };

    console.log('branchByStatus/makeUserDataAndDispatch userData', userData);

    dispatch({type: 'LOGIN', payload: userData});
  }

  /* 
  async function initializeSettings() {
    //2024-07-01 : AsynStroage 저장된 세팅 값을 초기화한다. 최초에는 모두 null 일 수 있다. 최초 시작 시에는 action, time, wind 모두 null 이다.
    //2024-07-02 : 로컬 저장 메모리 초기화 한다.
    await AsyncStorage.setItem('action', '2');
    await AsyncStorage.setItem('time', '1');
    await AsyncStorage.setItem('wind', '1');
    await AsyncStorage.setItem('repeat', '1');
    await AsyncStorage.setItem('pushDailyStartTime', new Date().toISOString());
    await AsyncStorage.setItem('pushWeeklyStartTime', new Date().toISOString());
    await AsyncStorage.setItem('daysOfWeek', '');
  }

  async function handleEmptyOzsId(
    decoded: UserFormInput,
    macAddress: string | null,
  ) {
    console.log(
      'decoded.ozsId가 비어있다., macAddress, ozsId',
      macAddress,
      decoded.ozsId,
    );

    const params: UserFormInput = {
      nickName: decoded.nickName,
      phoneNumber: decoded.phoneNumber,
      userId: decoded.userId === null || undefined ? '' : decoded.userId,
      ozsId: macAddress === null || undefined ? '' : macAddress,
    };

    try {
      const result = await uploadMacInfoToDB(params);
      console.log('handleEmptyOzsId upload 성공', result);

      const userData: UserFormInput = {
        ...decoded,
        ozsId: macAddress === null || undefined ? '' : macAddress,
      };
      await AsyncStorage.setItem(
        'ozsId',
        macAddress === null || undefined ? '' : macAddress,
      );
      dispatch({type: 'LOGIN', payload: userData});
    } catch (err) {
      console.log('upload 실패', err);
    }
  }

  async function handleNonEmptyOzsId(
    decoded: UserFormInput,
    macAddress: string | null,
  ) {
    console.log('ozsId 값이 있다, mac, ozsId', macAddress, decoded.ozsId);

    if (isEmpty(macAddress)) {
      console.log('mac address가 null 이다. 서버 ozsId 적용 ');
      await setAndDispatchUserData(decoded, decoded.ozsId!);
    } else if (isValidMacAddress(macAddress!) === false) {
      console.log('mac address is invalid');
      await setAndDispatchUserData(decoded, decoded.ozsId!);
    } else if (decoded.ozsId === macAddress) {
      console.log('ozsId와 mac address 동일');
      await setAndDispatchUserData(decoded, decoded.ozsId!);
    } else {
      console.log('ozsId와 mac address 다르다.');
      await handleOzsIdMismatch(decoded, macAddress!);
    }
  } */
  /* 
  async function setAndDispatchUserData(decoded: UserFormInput, ozsId: string) {
    const userData: UserFormInput = {
      ...decoded,
      ozsId,
    };

    await AsyncStorage.setItem('ozsId', ozsId);
    dispatch({type: 'LOGIN', payload: userData});
  }

  async function handleOzsIdMismatch(
    decoded: UserFormInput,
    macAddress: string,
  ) {
    const params: UserFormInput = {
      nickName: decoded.nickName,
      phoneNumber: decoded.phoneNumber,
      userId: decoded.userId === null || undefined ? '' : decoded.userId,
      ozsId: macAddress === null || undefined ? '' : macAddress,
    };

    try {
      const result = await uploadMacInfoToDB(params);
      console.log('handleOzsIdMismatch upload 성공', result);

      const userData: UserFormInput = {
        ...decoded,
        ozsId: macAddress === null || undefined ? '' : macAddress,
      };
      await AsyncStorage.setItem(
        'ozsId',
        macAddress === null || undefined ? '' : macAddress,
      );
      dispatch({type: 'LOGIN', payload: userData});
    } catch (err) {
      console.log('upload 실패', err);
    }
  } */

  /*
  else if (element.status === AuthStatus.SAME_DEVICE_LOGIN) {
    console.log('branchByStatus : SAME_DEVICE_LOGIN:  element = ', element);

    saveToken(element.data.token);

    try {
      // const ozsId = await AsyncStorage.getItem('ozsId');
      // console.log('branchByStatus ozsId = ', ozsId);

      //2024-07-01 : AsynStroage 저장된 세팅 값을 초기화한다. 최초에는 모두 null 일 수 있다. 최초 시작 시에는 action, time, wind 모두 null 이다.
      //2024-07-02 : 로컬 저장 메모리 초기화 한다.
      await AsyncStorage.setItem('action', '2');
      await AsyncStorage.setItem('time', '1');
      await AsyncStorage.setItem('wind', '1');
      await AsyncStorage.setItem('repeat', '1');
      await AsyncStorage.setItem(
        'pushDailyStartTime',
        new Date().toISOString(),
      );
      await AsyncStorage.setItem(
        'pushWeeklyStartTime',
        new Date().toISOString(),
      );
      await AsyncStorage.setItem('daysOfWeek', '');

      // 2024-05-07 : ozsId가 token에 포함되어서 온다. 회원가입 시에 ozsId, 즉 시리얼 번호를 입력한다.
      const decoded = jwtDecode(element.data.token) as UserFormInput;

      console.log('branchByStatus decoded = ', decoded);
      const macAddress = await AsyncStorage.getItem('macAddress');

      if (isEmpty(decoded.ozsId)) {
        // decoded.ozsId가 null 인 경우, DB를 업데이트한다.
        console.log(
          'decoded.ozsId가 비어있다., macAddress, ozsId',
          macAddress,
          decoded.ozsId,
        );
        const params: UserFormInput = {
          nickName: decoded.nickName,
          phoneNumber: decoded.phoneNumber,
          userId: decoded.userId,
          ozsId: macAddress!,
        };
        uploadMacInfoToDB(params)
          .then(result => {
            console.log('upload 성공', result);
          })
          .catch(err => {
            console.log('upload 실패', err);
          })
          .finally(async () => {
            const userData: UserFormInput = {
              isAdmin: decoded.isAdmin,
              isProducer: decoded.isProducer,
              nickName: decoded.nickName,
              phoneNumber: decoded.phoneNumber,
              userId: decoded.userId,
              ozsId: macAddress!,
            };
            // 업로드 한 후에 ozsId를 저장한다.
            await AsyncStorage.setItem('ozsId', macAddress!);
            dispatch({type: 'LOGIN', payload: userData});
          });
      } else {
        //  decoded.ozsId가 값이 있다. 이경우는 그냥 진행을 하면 된다.
        console.log(' ozsId 값이 있다, mac, ozsId', macAddress, decoded.ozsId);
        if (isEmpty(macAddress)) {
          console.log('mac address가 null 이다. 서버 ozsId 적용 ');
          const userData: UserFormInput = {
            isAdmin: decoded.isAdmin,
            isProducer: decoded.isProducer,
            nickName: decoded.nickName,
            phoneNumber: decoded.phoneNumber,
            userId: decoded.userId,
            ozsId: decoded.ozsId,
          };

          // ozsId를 서버에서 받아온 경우, 세팅한다.
          await AsyncStorage.setItem('ozsId', decoded.ozsId!);
          dispatch({type: 'LOGIN', payload: userData});
        } else if (isValidMacAddress(macAddress!) === false) {
          console.log('mac address is invalid');
          const userData: UserFormInput = {
            isAdmin: decoded.isAdmin,
            isProducer: decoded.isProducer,
            nickName: decoded.nickName,
            phoneNumber: decoded.phoneNumber,
            userId: decoded.userId,
            ozsId: decoded.ozsId,
          };

          // ozsId를 서버에서 받아온 경우, 세팅한다.
          await AsyncStorage.setItem('ozsId', decoded.ozsId!);
          dispatch({type: 'LOGIN', payload: userData});
        } else if (decoded.ozsId === macAddress) {
          console.log('ozsId와 mac address 동일');

          const userData: UserFormInput = {
            isAdmin: decoded.isAdmin,
            isProducer: decoded.isProducer,
            nickName: decoded.nickName,
            phoneNumber: decoded.phoneNumber,
            userId: decoded.userId,
            ozsId: decoded.ozsId,
          };

          // ozsId를 서버에서 받아온 경우, 세팅한다.
          await AsyncStorage.setItem('ozsId', decoded.ozsId!);
          dispatch({type: 'LOGIN', payload: userData});
        } else if (decoded.ozsId !== macAddress) {
          console.log('ozsId와 mac address 다르다.');

          const params: UserFormInput = {
            nickName: decoded.nickName,
            phoneNumber: decoded.phoneNumber,
            userId: decoded.userId,
            ozsId: macAddress!,
          };

          uploadMacInfoToDB(params)
            .then(result => {
              console.log('upload 성공', result);
            })
            .catch(err => {
              console.log('upload 실패', err);
            })
            .finally(async () => {
              const userData: UserFormInput = {
                isAdmin: decoded.isAdmin,
                isProducer: decoded.isProducer,
                nickName: decoded.nickName,
                phoneNumber: decoded.phoneNumber,
                userId: decoded.userId,
                ozsId: macAddress!,
              };
              // 업로드 한 후에 ozsId를 저장한다.
              await AsyncStorage.setItem('ozsId', macAddress!);
              dispatch({type: 'LOGIN', payload: userData});
            });
        }
      }
    } catch (error) {}
  }
    */
};
