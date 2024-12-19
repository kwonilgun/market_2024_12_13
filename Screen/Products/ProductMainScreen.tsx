/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {ProductMainScreenProps} from '../model/types/TUserNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RFPercentage} from 'react-native-responsive-fontsize';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import colors from '../../styles/colors';

const ProductMainScreen: React.FC<ProductMainScreenProps> = props => {
  const onPressCenter = () => {
    console.log('WifiTest center home click');
  };

  const CenterCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressCenter}>
        <>
          <Icon style={{color: 'red', fontSize: RFPercentage(5)}} name="home" />
        </>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        isCenterView={true}
        // centerText={strings.HOME}
        centerCustomView={CenterCustomComponent}
        containerStyle={{paddingHorizontal: 8}}
        // isLeftView={true}
        // leftCustomView={LeftCustomComponent}
        rightText={''}
        rightTextStyle={{color: colors.lightBlue}}
        onPressRight={() => {}}
        // isRightView={true}
        // rightCustomView={RightCustomComponent}
      />

      <Text>Product Main Screen 입니다.</Text>
    </WrapperContainer>
  );
};

export default ProductMainScreen;
