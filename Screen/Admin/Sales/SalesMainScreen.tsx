/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import WrapperContainer from '../../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';




import { SalesMainScreenProps } from '../../model/types/TSalesNavigator';

const SalesMainScreen: React.FC<SalesMainScreenProps> = props => {
  const [loading, setLoading] = useState<boolean>(true);



  useFocusEffect(
    useCallback(() => {
      console.log('EditMainScreen : useFocusEffect');
      setLoading(true);

      return () => {
        setLoading(true);
      };
    }, []),
  );

  const onPressRight = () => {
      console.log('Profile.tsx onPressRight...');
    //   props.navigation.navigate('SystemInfoScreen');
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
        centerText= "판매 분석"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={false}
        onPressRight={() => {}}
        isRightView={true}
        rightCustomView={RightCustomComponent}
      />

      <View style={styles.VStack}>
            <TouchableOpacity
                  onPress={() => {
                    console.log('지난 1달 매출 차트 클릭');
                    props.navigation.navigate('SalesChartScreen');
                  }}
                  style={styles.saveButton}>
                  <Text style={styles.buttonText}>한달 매출</Text>
            </TouchableOpacity>
            <TouchableOpacity
                  onPress={() => {
                    console.log('월별 차트 클릭');
                    props.navigation.navigate('SalesMonthlyScreen');
                  }}
                  style={styles.saveButton}>
                  <Text style={styles.buttonText}>월별 매출</Text>
            </TouchableOpacity>
            <TouchableOpacity
                  onPress={() => {
                    console.log('월별  클릭');
                    props.navigation.navigate('ProfitMonthlyScreen');
                  }}
                  style={styles.saveButton}>
                  <Text style={styles.buttonText}>월별 수익</Text>
            </TouchableOpacity>

      </View>

    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
VStack: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: RFPercentage(3),
        justifyContent: 'center',
        alignItems: 'center', // 추가하여 수평 정렬
      },

    saveButton: {
        width: RFPercentage(30),
        height: 'auto',
        alignItems: 'center',
        backgroundColor: '#28a745',
        margin: RFPercentage(2),
        padding: RFPercentage(1),
        borderRadius: RFPercentage(1),
      },
    buttonText: {
          fontWeight: 'bold',
          fontSize: RFPercentage(2),
          color: colors.white,
        },
});

export default SalesMainScreen;
