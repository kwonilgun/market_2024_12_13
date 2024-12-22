/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useContext, useState} from 'react';
import {
  ActivityIndicator,
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
import {RFPercentage} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../styles/colors';
import {SystemInfoScreenProps} from '../model/types/TUserNavigator';
import strings from '../../constants/lang';
import {useFocusEffect} from '@react-navigation/native';
import {
  LanguageContext,
  useLanguage,
} from '../../context/store/LanguageContext';
import DeviceInfo from 'react-native-device-info';
import {useAuth} from '../../context/store/Context.Manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  confirmAlert,
  ConfirmAlertParams,
} from '../../utils/alerts/confirmAlert';
import GlobalStyles from '../../styles/GlobalStyles';

const SystemInfoScreen: React.FC<SystemInfoScreenProps> = props => {
  const {state, dispatch} = useAuth();

  const [localLanguage, setLocalLanguage] = useState<string>('');
  const [versionNum, setVersionNum] = useState<string>('');
  const [buildNum, setBuildNum] = useState<string>('');
  const {language} = useLanguage();
  const {changeLanguage} = useContext(LanguageContext);

  useFocusEffect(
    useCallback(() => {
      console.log('SystemInfoScreen : useFocusEffect [] language = ', language);

      if (language === 'kr') {
        setLocalLanguage('한국어');
      } else {
        setLocalLanguage('English');
      }

      const version = DeviceInfo.getVersion(); // "1.0.0"과 같은 형식의 버전 문자열
      const buildNumber = DeviceInfo.getBuildNumber(); // "1"과 같은 형식의 빌드 번호 문자열

      setVersionNum(version);
      setBuildNum(buildNumber);

      console.log(`App Version: ${version}`);
      console.log(`Build Number: ${buildNumber}`);

      return () => {};
    }, []),
  );

  const checkAndLogout = async (props: any) => {
    console.log('로그 아웃 ......');

    // 2024-05-26 : 로그 아웃 시에 동작이 되면 중단을 한다.

    try {
      await AsyncStorage.removeItem('phoneNumber');

      await AsyncStorage.removeItem('autoLogin');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');

      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.log('logout error = ', error);
    } finally {
      //   iotStop('on');
      dispatch({type: 'LOGOUT'});
      // 소켓을 끊는다.
      //   disconnectSocket();
      props.navigation.navigate('UserMain', {screen: 'LoginScreen'});
    }
  };

  const handleLogout = (props: any) => {
    // 로그아웃 처리 로직은 여기에 구현

    const param: ConfirmAlertParams = {
      title: strings.CONFIRMATION,
      message: strings.LOGOUT_STOP_OPERATION,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      func: (data: any) => {
        console.log('Profile.tsx: handleLogout');

        checkAndLogout(data);
      },
      params: [props],
    };

    confirmAlert(param);
  };
  const onPressLeft = () => {
    props.navigation.navigate('UserMain', {screen: 'ProfileScreen'});
  };

  const selectLanguage = async () => {
    // const value = await AsyncStorage.getItem('language');
    console.log('select language click value =', language);
    if (language === 'en') {
      setLocalLanguage('한국어');
      // strings.setLanguage('kr');
      changeLanguage('kr');
      // await AsyncStorage.setItem('language', 'kr');
    } else {
      setLocalLanguage('English');
      // strings.setLanguage('en');
      changeLanguage('en');
      // await AsyncStorage.setItem('language', 'en');
    }
  };

  const handlePrivacyPolicy = (props: any) => {
    console.log('SystemInfoScreen : handlePrivacyPolicy');
    props.navigation.navigate('PrivacyPolicyScreen');
  };

  const handleUsageTerm = (props: any) => {
    console.log('SystemInfoScreen : handleUsageTerm');
    props.navigation.navigate('UsageTermScreen');
  };

  const LeftCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressLeft}>
        <>
          {/* <Text style={styles.leftTextStyle}>홈</Text> */}
          <Icon
            style={{color: colors.lightBlue, fontSize: RFPercentage(5)}}
            name="arrow-left"
          />
        </>
      </TouchableOpacity>
    );
  };
  const onPressRight = () => {
    console.log('Login.Screen right  click');
    selectLanguage();
  };

  const RightCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressRight}>
        <>
          <Icon
            style={{color: 'black', fontSize: RFPercentage(5)}}
            name="language"
          />
        </>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        //    isCenterView={true}
        centerText={strings.SYSINFO}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        rightText={''}
        rightTextStyle={{color: colors.lightBlue}}
        onPressRight={() => {}}
        isRightView={true}
        rightCustomView={RightCustomComponent}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        <ScrollView style={GlobalStyles.scrollView}>
          <View style={GlobalStyles.VStack}>
            <View style={styles.HSStack}>
              <View>
                <Text style={styles.inputTitle}>
                  {strings.VERSION}: {versionNum}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                console.log('회원 탈퇴 클릭');
                //  handleExitMember(props);
              }}>
              <View style={styles.HIStack}>
                <Text style={styles.buttonText}>{strings.EXIT_MEMBER}</Text>

                <Icon name="arrow-right" size={RFPercentage(3)} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log('Profile: 로그 아웃 클릭');
                handleLogout(props);
              }}>
              <View style={styles.HIStack}>
                <Text style={styles.buttonText}>{strings.LOGOUT}</Text>

                <Icon name="arrow-right" size={RFPercentage(3)} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('Profile: 이용약관');
                handleUsageTerm(props);
              }}>
              <View style={styles.HIStack}>
                <Text style={styles.buttonText}>
                  {strings.TERMS_OF_SERVICE}
                </Text>

                <Icon name="arrow-right" size={RFPercentage(3)} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('Profile: 개인정보처리');
                handlePrivacyPolicy(props);
              }}>
              <View style={styles.HIStack}>
                <Text style={styles.buttonText}>{strings.PRIVACY_POLICY}</Text>

                <Icon name="arrow-right" size={RFPercentage(3)} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  scrollInnerView: {
    marginTop: RFPercentage(1),
    borderColor: 'blue',
  },

  VSStack: {
    flexDirection: 'column',
    height: RFPercentage(40),
    margin: RFPercentage(3),
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: 5,
  },

  HSStack: {
    padding: RFPercentage(1),
    height: RFPercentage(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'blue',
    borderBottomWidth: 2,
  },

  HIStack: {
    //2024-10-31 : height : 8->7로 조정
    height: RFPercentage(7),
    padding: RFPercentage(2),

    // 2024-10-31 : 2->1 로 조정
    marginVertical: RFPercentage(1),
    marginHorizontal: RFPercentage(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.lightBlue,
  },
  HUStack: {
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: colors.lightBlue,
  },

  statusText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: RFPercentage(2.0),
    marginTop: 5,
    marginLeft: 20,
  },

  consumeTitleText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: RFPercentage(2.0),
    marginTop: 5,
    marginLeft: 20,
  },

  consumeText: {
    // fontWeight: 'bold',
    color: 'black',
    fontSize: RFPercentage(2.0),
    marginTop: 5,
    marginLeft: 40,
  },

  inputTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    color: colors.white,
  },
});

export default SystemInfoScreen;
