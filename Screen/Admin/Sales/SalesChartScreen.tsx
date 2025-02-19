/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  Dimensions, FlatList, StyleSheet, Text, TouchableOpacity,
  View
} from 'react-native';
import WrapperContainer from '../../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';

import LoadingWheel from '../../../utils/loading/LoadingWheel';

import axios, { AxiosResponse } from 'axios';

import { LineChart, lineDataItem } from 'react-native-gifted-charts'; // Import necessary types

import { baseURL } from '../../../assets/common/BaseUrl';


import { getToken } from '../../../utils/getSaveToken';
import { SalesChartScreenProps } from '../../model/types/TSalesNavigator';
import { alertMsg } from '../../../utils/alerts/alertMsg';
import strings from '../../../constants/lang';
import moment from 'moment';
import { styles } from './ProfitMonthlyScreen';


// 판매 데이터의 타입을 정의합니다.
interface SalesData {
  date: string; // 날짜
  total_sales: number; // 총 판매액
}

const SalesChartScreen: React.FC<SalesChartScreenProps> = props => {
  const [loading, setLoading] = useState<boolean>(true);

  // 판매 데이터를 상태로 관리합니다.
  const [salesData, setSalesData] = useState<SalesData[]>([]);


  useFocusEffect(
    useCallback(() => {
      console.log('SalesChartScreen : useFocusEffect');
      fetchSalesData();
    }, []),
  );

  // 컴포넌트가 마운트될 때 API에서 데이터를 가져옵니다.
  const fetchSalesData = async () => {
    try {
          const token = await getToken();
          const response: AxiosResponse = await axios.get(
            `${baseURL}sales/summary`,
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );

          if(response.status === 200){
            console.log('sales data from AWS', response.data);
            if (Array.isArray(response.data)) {
              setSalesData(response.data);
            } else {
              console.error('Unexpected sales data format:', response.data);
              alertMsg(strings.ERROR, '서버에서 예상치 못한 응답을 받았습니다.');
            }
          }

      }

     catch (error) {
          console.log('SalesCharScreens fetchSalesData error', error);
          alertMsg(strings.ERROR, 'sales 데이터 획득 실패');
    } finally {
          setLoading(false);
    }
  };

  // 차트에 표시할 데이터를 구성합니다.
  // const chartData = salesData.map((item) => item.total_sales);

  const onPressLeft = () => {
    props.navigation.navigate('SalesMainScreen');
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
          }}
          name="arrow-left"
        />
      </TouchableOpacity>
    );
  };

  const chartData: lineDataItem[] = salesData.map(item => ({
    value: item.total_sales, // Use 'value' for y-axis
    label: moment(item.date).format('M/D'), // Example: "Jan 01"
    // label: item.date.substring(5),      // Use 'label' for x-axis (or keep it as date if needed)
    // ... other lineDataItem properties as needed (e.g., color, etc.)
  }));

  const renderItem = ({ item }: { item: SalesData }) => (
        <View style={styles.listItem}>
          <Text style={styles.monthText}>{moment(item.date).format('YYYY년 MM월 DD일')}</Text>
          <Text style={styles.profitText}>매출: {item.total_sales.toLocaleString()}원</Text>
        </View>
      );
  

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText="매출 차트"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />

      {loading ? (
        <>
          <LoadingWheel />
        </>
      ) : (
        <View style={{marginTop:RFPercentage(5), marginHorizontal:RFPercentage(1), alignSelf:'center'}} >
          {/* react-native-svg-charts의 LineChart 컴포넌트를 사용하여 차트를 렌더링합니다. */}
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - RFPercentage(15)} // Adjust width as needed
            height={300} // Adjust height as needed
        
            maxValue={10000}
                      // hideYAxisText={true}

            formatYLabel = {(label:string)=> Math.round(parseFloat(label) / 1000.0).toString()}

            yAxisLabelWidth={30}
            yAxisLabelSuffix="k" // Add prefix to y-axis labels if needed
            xAxisLabelTextStyle={{
              rotation: 90, // Rotate x-axis labels by 90 degrees
              fontSize: 12, // Adjust font size if needed
              color: 'blue', // Adjust color if needed
            }}
            dataPointsColor={'red'} // 데이터 포인트의 색상
            // showDataPointLabelOnFocus={true}
            showYAxisIndices={true}
            showXAxisIndices={true}
            // showValuesAsDataPointsText={true}
        />
        <FlatList
                data={salesData}
                renderItem={renderItem}
                keyExtractor={(item) => item.date!}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                              <Text style={styles.emptyMessage}> 리스트 없음.</Text>
                            }
          />

        </View>
      )}
    </WrapperContainer>
  );
};

// const styles = StyleSheet.create({
//     listContainer: {
//         margin: 8,
//         padding: 16,
//         borderWidth: 1,
//         borderRadius: 10,
//         backgroundColor: '#E0E0E0',
//       },
//       itemContainer: {
//         marginBottom: 10,
//       },
// });

export default React.memo(SalesChartScreen);