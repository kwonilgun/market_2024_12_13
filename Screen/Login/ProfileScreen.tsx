/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useRef, useState} from 'react';

import {ProfileScreenProps} from '../model/types/TUserNavigator';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RFPercentage} from 'react-native-responsive-fontsize';
import strings from '../../constants/lang';
import {useAuth} from '../../context/store/Context.Manager';
import {useFocusEffect} from '@react-navigation/native';
import {IAuth, IUserAtDB, UserFormInput} from '../model/interface/IAuthInfo';
import {getToken} from '../../utils/getSaveToken';
import {jwtDecode} from 'jwt-decode';
import axios, {AxiosResponse} from 'axios';
import {baseURL} from '../../assets/common/BaseUrl';
import {alertMsg} from '../../utils/alerts/alertMsg';
import {IOrderInfo} from '../model/interface/IOrderInfo';
import groupBy from 'group-by';
import {DataList, makeExpandableDataList} from '../Orders/makeExpandable';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import GlobalStyles from '../../styles/GlobalStyles';
import {width} from '../../assets/common/BaseValue';
import {useForm} from 'react-hook-form';
import InputField from '../../utils/InputField';

interface IUserInfo {
  nickName: string;
  phone: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = props => {
  const {state, dispatch} = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<IUserAtDB | null>(null);
  const [dataList, setDataList] = useState<DataList | null>(null);
  // const [producersGroup, setProducerGroup] = useState({});
  const userIdRef = useRef<string>('');

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IUserInfo>({
    defaultValues: {
      phone: '',
      nickName: '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      console.log(
        'UserProfile.tsx: useFocusEffect : isAuthenticated = ',
        state.isAuthenticated,
      );

      setIsLogin(true);
      getUserProfile();
      checkOrderList();

      return () => {
        setUserProfile(null);
      };
    }, []),
  );

  const getUserProfile = async () => {
    const token = await getToken();
    const decoded = jwtDecode(token!) as UserFormInput;
    const userId = decoded.userId;
    console.log('userProfile userId= ', userId);
    userIdRef.current = userId!;

    try {
      const response: AxiosResponse = await axios.get(
        `${baseURL}users/${userId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        console.log('ProfileScreen 사용자 데이터 = ', response.data);
        const userData: IUserInfo = {
          phone: response.data.phone,
          nickName: response.data.nickName,
        };
        reset(userData);
        setUserProfile(response.data);
      } else {
        alertMsg(strings.ERROR, '사용자 정보 가져오지 못함');
      }
    } catch (error) {
      console.log('ProfileScreen get user error = ', error);
      alertMsg(strings.ERROR, '사용자 정보 가져오지 못함...');
    }
  };

  const checkOrderList = async () => {
    try {
      const response: AxiosResponse = await axios.get(
        `${baseURL}orders/${userIdRef.current}`,
      );

      const orders = response.data as IOrderInfo[];

      if (orders.length) {
        // 2023-05-20 : Date를 new를 통해서 값으로 변환해야 소팅이 동작이 된다. 아니면 NaN이 리턴이 된다.
        orders.sort(
          (a, b) =>
            new Date(b.dateOrdered).getTime() -
            new Date(a.dateOrdered).getTime(),
        );

        //💇‍♀️2023-05-22 :생산자 전화번호에  따라서 그룹핑을 한다. 전화번호는 변경이 되지 않기 때문에 이것을 이용해서 그룹핑을 하고, 생산자는 해당 정보에서 추출하면 된다. 전화번호가 핵심이다.

        /***
            Record는 TypeScript에서 제공하는 유틸리티 타입 중 하나로, 특정 키-값 쌍의 구조를 정의할 때 사용됩니다. Record는 다음과 같은 형태로 사용됩니다:
            Record<KeyType, ValueType>
            주요 특징
            KeyType: 객체의 키에 사용할 타입. 보통 string, number, symbol 또는 이러한 타입의 유니온을 사용합니다.
            ValueType: 각 키에 해당하는 값의 타입.
            Record를 사용하면 특정 키-값 쌍을 효율적으로 정의하고 타입 안전성을 유지할 수 있습니다.
        ****/
        const result: Record<string, IOrderInfo[]> = groupBy(
          orders,
          'producerPhone',
        );

        console.log('checkOrderList result', result);

        // setProducerGroup(result);
        makeExpandableDataList(orders, setDataList);

        // setLoading(false);
      }
    } catch (error) {
      console.log('ProfileScreen CheckOrderList error', error);
    } finally {
      setLoading(false);
    }
  };

  const onPressRight = () => {
    console.log('Profile.tsx onPressRight...');
    props.navigation.navigate('SystemInfoScreen');
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const RightCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressRight}>
        <>
          {/* <Text style={styles.leftTextStyle}>홈</Text> */}
          <Icon
            style={{color: colors.lightBlue, fontSize: RFPercentage(5)}}
            name="gear"
          />
        </>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={strings.USER_PROFILE}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={false}
        onPressRight={() => {}}
        isRightView={true}
        rightCustomView={RightCustomComponent}
      />

      {loading ? (
        <>
          <LoadingWheel />
        </>
      ) : (
        <>
          {!isLogin ? (
            <View style={{alignItems: 'center', marginTop: 10}}>
              <View style={{margin: RFPercentage(2), alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('CartMainScreen: 로그인 필요합니다. ');
                  }}>
                  <View style={GlobalStyles.buttonSmall}>
                    <Text style={GlobalStyles.buttonTextStyle}>
                      "로그인 필요합니다"
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={GlobalStyles.containerKey}>
              <ScrollView
                style={GlobalStyles.scrollView}
                keyboardShouldPersistTaps="handled">
                <View style={GlobalStyles.VStack}>
                  <View style={styles.HStackTitle}>
                    <Text style={styles.HeadTitleText}>사용자 정보</Text>

                    <TouchableOpacity
                      onPress={() => {
                        console.log('사용자 정보 업로드');
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>{strings.UPLOAD}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.UserInfoBorderBox}>
                    <Text style={[GlobalStyles.inputTitle]}>
                      {strings.EMAIL}
                    </Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        name="nickName"
                        placeholder={strings.PLEASE_ENTER_NAME}
                        keyboard="name-phone-pad" // 숫자 판으로 변경
                        isEditable={false}
                      />
                      {errors.nickName && (
                        <Text style={GlobalStyles.errorMessage}>
                          {strings.NAME} {strings.ERROR}
                        </Text>
                      )}
                    </View>
                    <Text style={GlobalStyles.inputTitle}>{strings.PHONE}</Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 11,
                          maxLength: 11,
                          pattern: /^01(?:0)\d{4}\d{4}$/,
                        }}
                        name="phone"
                        placeholder={strings.PLEASE_ENTER_TEL}
                        keyboard="phone-pad" // 숫자 판으로 변경
                        // isEditable={false}
                      />
                      {errors.phone && (
                        <Text style={GlobalStyles.errorMessage}>
                          전화번호 에러.
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </>
      )}
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  HStackTitle: {
    flexDirection: 'row',
    marginTop: RFPercentage(1),
    padding: RFPercentage(0.5),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeadTitleText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(3),
    marginTop: RFPercentage(2),
  },

  UserInfoBorderBox: {
    marginVertical: RFPercentage(1),
    padding: RFPercentage(1),
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: RFPercentage(2),
  },
  HCStack: {
    marginHorizontal: width * 0.1,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',

    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    color: colors.white,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    width: RFPercentage(10),
    height: 'auto',
    alignItems: 'center',
    backgroundColor: '#28a745',
    marginTop: RFPercentage(1),
    padding: RFPercentage(1),
    borderRadius: RFPercentage(1),
  },
});

export default ProfileScreen;
