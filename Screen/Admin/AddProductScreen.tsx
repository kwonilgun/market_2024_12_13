/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
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
import { RFPercentage } from 'react-native-responsive-fontsize';
import strings from '../../constants/lang';
import { useAuth } from '../../context/store/Context.Manager';
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../../utils/getSaveToken';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../../assets/common/BaseUrl';
import { alertMsg } from '../../utils/alerts/alertMsg';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import GlobalStyles from '../../styles/GlobalStyles';
import { width } from '../../assets/common/BaseValue';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../../utils/InputField';
import { errorAlert } from '../../utils/alerts/errorAlert';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    confirmAlert,
    ConfirmAlertParams,
} from '../../utils/alerts/confirmAlert';
import { IProduct } from '../model/interface/IProductInfo';
import { AddProductScreenProps } from '../model/types/TEditNavigator';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker'; // 추가
import mime from 'mime';



const AddProductScreen: React.FC<AddProductScreenProps> = props => {
  const {state} = useAuth();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [product, setProduct] = useState<IProduct | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null); // 이미지 상태 추가



  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IProduct>({
    defaultValues: {
      id: '',
      name: '',
      image: '',
      description: '',
      richDescription: '',
      brand: '',
      price:'',
      discount: '',
      countInStock: '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      console.log(
        'AddProductScreen useFocusEffect'
      );

      // setProduct(props.route.params.item);

      return () => {
        // setLoading(true);
      };
    }, []),
  );


  const isChanged = () => {
    const currentValues = getValues();

    // defaultValues의 타입 정의
    const defaultValues: any = {
      name: '',
      image: '',
      description: '',
      richDescription: '',
      brand: '',
      price: '',
      discount: '',
      countInStock: '',
    };

    // 기본값과 현재 값 비교
    const hasChanged = (Object.keys(defaultValues) as (keyof typeof currentValues)[]).some(
      key => defaultValues[key] !== currentValues[key]
    );

    console.log('isChanged: ', hasChanged);
    return hasChanged;
  };


  const confirmUpload: SubmitHandler<IProduct> = async data => {
    const param: ConfirmAlertParams = {
      title: strings.CONFIRMATION,
      message: '상품 추가',
      func: async (in_data: IProduct) => {
        console.log('업로드 상품 추가 data = ', in_data);
        const token = await getToken();

        // 이미지를 업로드 할경우 form태그에 entype 속성값을 multipart/form-data로 설정해주면 이미지파일도 값이 전송할수 있다.
        // multipart/form-data 는 post를 통해 파일을 보낼 수 있는 인코딩 유형이다

        let formData = new FormData();

        formData.append('name', in_data.name);
        formData.append('brand', in_data.brand);
        formData.append('price', in_data.price);
        formData.append('discount', in_data.discount);
        formData.append('description', in_data.description);
        formData.append('category', in_data.category);
        formData.append('countInStock', in_data.countInStock);
        // formData.append('richDescription', richDescription);
        formData.append('rating', in_data.rating);
        formData.append('numReviews', in_data.numReviews);
        formData.append('isFeatured', in_data.isFeatured);
        formData.append('richDescription', in_data.richDescription);
        formData.append('dateCreated', Date.now());

        //2023-01-29 : 추가함
        formData.append('user', in_data.user);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', //이미지 전송을 위해서
            //     "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        };

        let serverImageUri;
        if (newImage) {
          //로컬 카메라에서 이미지를 가져왔다.
          serverImageUri = 'file:///' + newImage.split('file:/').join('');
          formData.append('image', {
            uri: serverImageUri,
            type: mime.getType(serverImageUri),
            name: serverImageUri.split('/').pop(), //마지막 이름
          });

        } else {
          formData.append('dataExist', 'yes');
        }

        console.log('EditProductScreen formData', formData);

        axios
          .post(`${baseURL}products`, formData, config)
          .then(res => {
            if (res.status === 200 || res.status === 201) {
             alertMsg('success', '상품 성공적으로 추가됨');
              // props.navigation.navigate("Products");
              // props.navigation.goBack();
            }
          })
          .catch(error => {
            console.error(error);
            // alert("1. 상품 업데이트 실패" + error)
            // setShowModal(false);
            errorAlert('1. 상품업로드 에러', ' ' + error);
          });

      },
      params: [data],
    };

    confirmAlert(param);
  };

  const uploadProductInfo = () => {
    console.log('채팅 사용자 정보 업로드');
    if (isChanged()) {
      console.log('데이타가 변경되었습니다. ');
      handleSubmit(confirmUpload)();
    } else {
      errorAlert(strings.ERROR, '데이터 변경이 없음');
    }
  };

  const onPressLeft = () => {
    props.navigation.navigate('EditManager', {screen: 'EditMainScreen'});
  };

  const LeftCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressLeft}>
        <FontAwesome
          style={{
            marginHorizontal: RFPercentage(1),
            color: colors.black,
            fontSize: RFPercentage(5),
            fontWeight: 'bold',
          }}
          name="arrow-left"
        />
      </TouchableOpacity>
    );
  };

  // 갤러리에서 이미지 선택 함수
  const selectImageFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri; // 선택한 이미지의 URI
      setNewImage(imageUri!); // 상태 업데이트
      setValue('image', imageUri);
    }
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText={'상품 추가'}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />

      {/* {loading ? (
        <>
          <LoadingWheel />
        </>
      ) : ( */}
        <>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={GlobalStyles.containerKey}>
              <ScrollView
                style={GlobalStyles.scrollView}
                keyboardShouldPersistTaps="handled">
                <View style={GlobalStyles.VStack}>
                  <View style={styles.HStackTitle}>
                    {/* <Text style={styles.HeadTitleText}>채팅정보</Text> */}

                    <TouchableOpacity
                      onPress={() => {
                        uploadProductInfo();
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>{strings.REGISTER}</Text>
                    </TouchableOpacity>

                  </View>

                  <View style={styles.UserInfoBorderBox}>

                    <View style={[styles.imageContainer]}>
                        {/* FastImage로 이미지 렌더링 */}
                        {newImage ? (
                          <FastImage
                            style={styles.image}
                            source={{ uri: newImage }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : null }
                    </View>
                    <TouchableOpacity
                      onPress={selectImageFromGallery}
                      style={{
                        alignItems: 'center', // 수평 가운데 정렬
                        justifyContent: 'center', // 수직 가운데 정렬
                        // marginTop: RFPercentage(2), // 여백 추가
                      }}>
                      <FontAwesome
                        style={styles.camera}
                        name="camera"
                      />
                    </TouchableOpacity>
                    {/* 이름 */}
                    <Text style={[GlobalStyles.inputTitle]}>
                      {strings.NAME}
                    </Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        name="name"
                        placeholder={strings.PLEASE_ENTER_NAME}
                        keyboard="name-phone-pad" // 숫자 판으로 변경
                        isEditable={true}
                      />
                      {errors.name && (
                        <Text style={GlobalStyles.errorMessage}>
                          {strings.NAME} {strings.ERROR}
                        </Text>
                      )}
                    </View>
                    {/* 브랜드 */}
                    <Text style={[GlobalStyles.inputTitle]}>
                      브랜드
                    </Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 1,
                        }}
                        name="brand"
                        placeholder={strings.PLEASE_ENTER_NAME}
                        keyboard="name-phone-pad" // 숫자 판으로 변경
                        isEditable={true}
                      />
                      {errors.name && (
                        <Text style={GlobalStyles.errorMessage}>
                          브랜드 {strings.ERROR}
                        </Text>
                      )}
                    </View>

                    {/* 재고수량 */}
                    <Text style={[GlobalStyles.inputTitle]}>
                      재고수량(개)
                    </Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 1,
                        }}
                        name="countInStock"
                        placeholder={strings.PLEASE_ENTER_NAME}
                        keyboard="number-pad" // 숫자 판으로 변경
                        isEditable={true}
                      />
                      {errors.name && (
                        <Text style={GlobalStyles.errorMessage}>
                          재고수량 {strings.ERROR}
                        </Text>
                      )}
                    </View>

                      {/* 가격 */}
                    <Text style={[GlobalStyles.inputTitle]}>
                      가격(원)
                    </Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 1,
                        }}
                        name="price"
                        placeholder="가격"
                        keyboard="number-pad" // 숫자 판으로 변경
                        isEditable={true}
                      />
                      {errors.name && (
                        <Text style={GlobalStyles.errorMessage}>
                          가격 {strings.ERROR}
                        </Text>
                      )}
                    </View>

                    <Text style={[GlobalStyles.inputTitle]}>
                      할인(%)
                    </Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                          required: true,
                          minLength: 1,
                        }}
                        name="discount"
                        placeholder="할인"
                        keyboard="number-pad" // 숫자 판으로 변경
                        isEditable={true}
                      />
                      {errors.name && (
                        <Text style={GlobalStyles.errorMessage}>
                          할인 {strings.ERROR}
                        </Text>
                      )}
                    </View>

                    <Text style={GlobalStyles.inputTitle}>설명</Text>
                    <View style={GlobalStyles.HStack}>
                      <InputField
                        control={control}
                        rules={{
                            required: true,
                            minLength: 1,
                        }}
                        name="description"
                        placeholder= "설명"
                        keyboard="ascii-capable" // 숫자 판으로 변경
                        isEditable={true}
                        multiline={true}
                        numberOfLines={50}
                      />
                      {errors.description && (
                        <Text style={GlobalStyles.errorMessage}>
                          설명에러
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
        </>
      {/* )} */}
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center', // 수평 가운데 정렬
    justifyContent: 'center', // 수직 가운데 정렬 (필요 시 추가)
    marginVertical: RFPercentage(2), // 상하 여백
  },
  image: {
    width: RFPercentage(30),
    height: RFPercentage(20),
    borderRadius: 10,
  },

  cameraContainer:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  camera: {
    marginHorizontal: RFPercentage(1),
    color: colors.black,
    fontSize: RFPercentage(5),
    fontWeight: 'bold',
  },

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
  orderButton: {
    width: width * 0.88,
    height: 'auto',
    alignItems: 'center',
    backgroundColor: '#28a745',
    marginTop: RFPercentage(2),
    padding: RFPercentage(2),
    borderRadius: RFPercentage(1),
  },
});

export default AddProductScreen;
