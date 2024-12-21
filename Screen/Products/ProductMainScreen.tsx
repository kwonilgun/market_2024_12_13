/* eslint-disable @typescript-eslint/no-shadow */
/*
 * File: ProductMainScreen.tsx
 * Project: market_2024_12_13
 * File Created: Thursday, 19th December 2024 10:20:25 am
 * Author: Kwonilgun(권일근) (kwonilgun@naver.com)
 * -----
 * Last Modified: Thursday, 19th December 2024 10:19:11 pm
 * Modified By: Kwonilgun(권일근) (kwonilgun@naver.com>)
 * -----
 * Copyright <<projectCreationYear>> - 2024 루트원 AI, 루트원 AI
 * 2024-12-19 : 생성
 */

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */

import React, {useCallback, useRef, useState} from 'react';
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
import {ProductMainScreenProps} from '../model/types/TUserNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RFPercentage} from 'react-native-responsive-fontsize';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import colors from '../../styles/colors';
import {useAuth} from '../../context/store/Context.Manager';
import {useFocusEffect} from '@react-navigation/native';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import {COMPANY_INFO_ID, height} from '../../assets/common/BaseValue';
import GlobalStyles from '../../styles/GlobalStyles';
import axios, {AxiosResponse} from 'axios';
import {baseURL} from '../../assets/common/BaseUrl';
import {getToken} from '../../utils/getSaveToken';
import {IProduct} from '../model/interface/IProductInfo';
import {ICategory} from '../model/interface/ICategory';
import {ICompany} from '../model/interface/ICompany';
import ProductList from './ProductList';
import strings from '../../constants/lang';

const ProductMainScreen: React.FC<ProductMainScreenProps> = props => {
  const {state} = useAuth();

  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [productsFiltered, setProductsFiltered] = useState<IProduct[] | []>([]);
  const [productsCtg, setProductsCtg] = useState<IProduct[] | []>([]);
  const [focus, setFocus] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [active, setActive] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [bannerList, setBannerList] = useState<any[]>([]);
  const [companyInform, setCompanyInform] = useState<ICompany | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAnotherLogin, setIsAnotherLogin] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const initialState = useRef<IProduct[]>([]);

  useFocusEffect(
    useCallback(() => {
      console.log('1. ProductMainScreen : useFocusEffect... 진입');
      setFocus(false);
      setActive(-1);

      if (state.isAuthenticated) {
        console.log(
          'ProductMainScreen useFocusEffect: 소켓이 있고, 로그인 상태, 💇‍♀️상품정보를 읽어온다',
        );

        setIsLogin(true);

        fetchProductInformFromServer();
      } else {
        console.log('ProductMainScreen useFocusEffect: 로그 아웃상태');
        setIsLogin(false);
        setLoading(false);
      }

      return () => {
        console.log('ProductMainScreen useFocusEffect 나감');
        setProducts([]);
        setProductsFiltered([]);
        setFocus(false);
        setCategories([]);
        setActive(-1);
        setLoading(true);
        setIsLogin(false);
        setIsAnotherLogin(false);
        setPhoneNumber('');
      };
    }, [state.isAuthenticated]),
  );

  const fetchProductInformFromServer = async () => {
    try {
      const token = await getToken();
      //헤드 정보를 만든다.
      const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
      };

      //fetch  Category inform from AWS
      const categoryResponse: AxiosResponse = await axios.get(
        `${baseURL}categories/`,
        config,
      );
      setCategories(categoryResponse.data);
      // fetch Product inform from AWS
      const productResponse: AxiosResponse = await axios.get(
        `${baseURL}products/`,
        config,
      );
      setProducts(productResponse.data);
      setProductsFiltered(productResponse.data);
      setProductsCtg(productResponse.data);
      initialState.current = productResponse.data;

      //3. 회사 정보를 가져온다.
      const companyResponse: AxiosResponse = await axios.get(
        `${baseURL}terms/${COMPANY_INFO_ID}`,
      );
      if (companyResponse.status === 200) {
        setCompanyInform(companyResponse.data[0]);
      } else {
        setCompanyInform(null);
      }
    } catch (error) {
      console.log('fetProductInformFromServer 에러..', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProduct = (text: string) => {
    setProductsFiltered(
      products.filter((product: IProduct) =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const changeCtg = (ctg: string) => {
    console.log('ProductContainer: changeCtg');

    ctg === 'all'
      ? [setProductsCtg(initialState.current), setActive(-1)]
      : [
          setProductsCtg(
            products.filter(
              (product: IProduct) => product.category!.id === ctg,
            ),
          ),
        ];
  };

  // const onPressCenter = () => {
  //   console.log('WifiTest center home click');
  // };

  // const CenterCustomComponent = () => {
  //   return (
  //     <TouchableOpacity onPress={onPressCenter}>
  //       <>
  //         <Icon style={{color: 'red', fontSize: RFPercentage(5)}} name="home" />
  //       </>
  //     </TouchableOpacity>
  //   );
  // };
  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        // isCenterView={true}
        centerText={strings.HOME}
        // centerCustomView={CenterCustomComponent}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={false}
        // leftCustomView={LeftCustomComponent}
        // rightText={''}
        // rightTextStyle={{color: colors.lightBlue}}
        // onPressRight={() => {}}
        isRight={false}
        // rightCustomView={RightCustomComponent}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.containerKey}>
        {loading ? (
          <>
            <LoadingWheel />
          </>
        ) : (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={styles.background}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  value={searchText}
                  placeholder="검색"
                  style={styles.textInput}
                  onFocus={openList}
                  onChangeText={text => {
                    if (focus) {
                      setSearchText(text);
                      searchProduct(text);
                    } else {
                      openList();
                      setSearchText(text);
                    }
                  }}
                />
                {focus && (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setSearchText('');
                      searchProduct('');
                      onBlur();
                    }}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {focus === true ? (
              <View style={styles.searchResultContainer}>
                {/* <SearchedProducts
                  productsFiltered={productsFiltered}
                  navigation={props.navigation}
                  companyInform={companyInform}
                /> */}
              </View>
            ) : (
              <View>
                {/* <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCtg}
                  productsCtg={productsCtg}
                  active={active}
                  setActive={setActive}
                /> */}

                {productsCtg.length > 0 ? (
                  <View style={styles.productsContainer}>
                    {productsCtg.map(item => (
                      <ProductList
                        navigation={props.navigation}
                        key={item.name}
                        item={item}
                        companyInform={companyInform!}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>해당 제품이 없음</Text>
                  </View>
                )}

                <View style={styles.divider} />

                {/* <TermsMain
                  companyInform={companyInform}
                  navigation={props.navigation}
                /> */}
              </View>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#f2f2f2',
    height: height,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  marginText: {
    margin: 10,
  },
  phoneNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  searchResultContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#87ceeb',
  },
  productsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  noProductsContainer: {
    height: height * 0.2,
    backgroundColor: '#dcdcdc',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 20,
  },
  divider: {
    marginTop: 20,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#87ceeb',
    borderRadius: 10,
    // width: SEARCH_BOX_WIDTH,
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#00bfff',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProductMainScreen;
