/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';

import {ProfileScreenProps} from '../model/types/TUserNavigator';
import {Text, TouchableOpacity} from 'react-native';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RFPercentage} from 'react-native-responsive-fontsize';
import strings from '../../constants/lang';

const ProfileScreen: React.FC<ProfileScreenProps> = props => {
  const onPressCenter = () => {
    console.log('WifiTest center home click');
  };

  const CenterCustomComponent = () => {
    return (
      <TouchableOpacity onPress={onPressCenter}>
        <>
          <Icon style={{color: 'red', fontSize: RFPercentage(5)}} name="user" />
        </>
      </TouchableOpacity>
    );
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
        // isCenterView={true}
        centerText={strings.USER_PROFILE}
        // centerCustomView={CenterCustomComponent}
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={false}
        // leftCustomView={LeftCustomComponent}
        // rightText={''}
        // rightTextStyle={{color: colors.lightBlue}}
        onPressRight={() => {}}
        isRightView={true}
        rightCustomView={RightCustomComponent}
      />

      <Text>Profile screen 입니다.</Text>
    </WrapperContainer>
  );
};

export default ProfileScreen;
