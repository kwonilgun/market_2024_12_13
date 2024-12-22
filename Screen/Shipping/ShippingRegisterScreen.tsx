/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import {RFPercentage} from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../styles/colors';
import strings from '../../constants/lang';
import {useFocusEffect} from '@react-navigation/native';

// import {useAuth} from '../../context/store/Context.Manager';

import GlobalStyles from '../../styles/GlobalStyles';
import {ShippingRegisterScreenProps} from '../model/types/TShippingNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

import deliveries from '../../assets/json/deliveries.json';
// import {confirmAlert} from '../../utils/alerts/confirmAlert';

const ShippingRegisterScreen: React.FC<ShippingRegisterScreenProps> = props => {
  //   const {state, dispatch} = useAuth();

  const [name, setName] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<number | undefined>(
    undefined,
  );
  const [deliveryId, setDeliveryId] = useState<string>('');
  const [checkMark, setCheckMark] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      console.log('ShippingRegisterScreen : useFocusEffect');
      getShippingData();

      return () => {};
    }, []),
  );

  const getShippingData = async () => {
    const tmp = await AsyncStorage.getItem('deliveryInfo');
    const data = JSON.parse(tmp!);

    setName(data.name);
    setPhone(data.phone);
    setAddress1(data.address1);
    setAddress2(data.address2);
    setDeliveryMethod(data.deliveryMethod);
    setDeliveryId(data.deliveryId);
    setCheckMark(data.checkMark);
  };

  const updateDeliveryInformToServer = () => {
    console.log('updateDeliveryInformToServer ....');
  };

  const addressChange = () => {
    console.log('addressChange ...');
  };

  const onPressLeft = () => {
    props.navigation.navigate('ShippingMainScreen');
  };

  const LeftCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressLeft}>
        <FontAwesome
          style={{
            height: RFPercentage(8),
            width: RFPercentage(10),
            marginTop: RFPercentage(2),
            color: colors.black,
            fontSize: RFPercentage(5),
            fontWeight: 'bold',
            // transform: [{scaleX: 1.5}], // 폭을 1.5배 넓힘
          }}
          name="arrow-left"
        />
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={strings.SYSINFO}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        <ScrollView style={GlobalStyles.scrollView}>
          <View style={GlobalStyles.VStack}>
            <Text style={styles.title}>배송지 정보 입력해주세요</Text>

            <TextInput
              style={styles.input}
              placeholder="이름"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="주소"
              value={address1}
              onChangeText={setAddress1}
            />
            <TouchableOpacity
              onPress={addressChange}
              style={styles.searchButton}>
              <Text style={styles.buttonText}>Find Address</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="상세주소"
              value={address2}
              onChangeText={setAddress2}
            />
            <TextInput
              style={styles.input}
              placeholder="전화번호"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <RNPickerSelect
              placeholder={{label: 'Delivery Request', value: null}}
              value={deliveryMethod}
              onValueChange={value => setDeliveryMethod(value)}
              items={deliveries.map((i: any, index: number) => ({
                label: i.name,
                value: index,
              }))}
            />
            <TouchableOpacity
              onPress={
                () => {
                  console.log('save confirm....');
                }
                //  confirmAlert(
                //    'Confirmation',
                //    'Do you want to save this delivery information?',
                //    updateDeliveryInformToServer,
                //  )
              }
              style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
});

export default ShippingRegisterScreen;
