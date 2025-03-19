/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WrapperContainer from '../../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../../utils/basicForm/HeaderComponents';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import { SalesMainScreenProps } from '../../model/types/TSalesNavigator';
import axios, { AxiosResponse } from 'axios';
import { getToken } from '../../../utils/getSaveToken';
import { baseURL } from '../../../assets/common/BaseUrl';
import { alertMsg } from '../../../utils/alerts/alertMsg';
import strings from '../../../constants/lang';
import LoadingWheel from '../../../utils/loading/LoadingWheel';
import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';
import moment from 'moment';
import { height, width } from '../../../styles/responsiveSize';

// 판매 데이터의 타입을 정의합니다.
interface SalesData {
  date: string; // 날짜
  total_sales: number; // 총 판매액
}

// 판매 데이터의 타입을 정의합니다.
interface SalesMonthlyData {
  month: string; // 날짜
  total_sales: string; // 총 판매액
}

const SalesMainScreen: React.FC<SalesMainScreenProps> = props => {
  const [loading, setLoading] = useState<boolean>(true);
   // 판매 데이터를 상태로 관리합니다.
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [salesMonthly, setSalesMonthly] = useState<SalesMonthlyData[]>([]);
  const [modalSales, setModalSales] = useState<boolean>(false);
  const [modalMonthly, setModalMonthly] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      console.log('SalesMainScreen : useFocusEffect');
      // setLoading(true);

      fetchSalesData();
      fetchMonthlyData();

      return () => {
        setLoading(true);
      };
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
              const sortedData = response.data.sort(
                (a: SalesData, b: SalesData) => new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              setSalesData(sortedData);
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



  // 컴포넌트가 마운트될 때 API에서 데이터를 가져옵니다.
  const fetchMonthlyData = async () => {
    try {
          const token = await getToken();
          const response: AxiosResponse = await axios.get(
            `${baseURL}sales/revenue/monthly`,
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );

          if(response.status === 200){
            console.log('sales monthly data from AWS', response.data);
            if (Array.isArray(response.data)) {
              setSalesMonthly(response.data);
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

  function formatDateToKorean(dateString: string): string {
    const date = new Date(dateString); // 이미 한국 시간 기준
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
    const day = date.getDate();
    console.log('SalesChartScreen - label = ', `${month}월 ${day}일`);
    return `${month}월 ${day}일`;
  }

  const chartData: lineDataItem[] = salesData
    .map(item => ({
      value: Number(item.total_sales), // Use 'value' for y-axis
      label: formatDateToKorean(item.date), // Example: "Jan 01"
      date: new Date(item.date), // Sorting을 위해 Date 객체 추가
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // 날짜 기준 정렬
    .map(({ date, ...rest }) => rest); // date 필드 제거

  const renderItem = ({ item }: { item: SalesData }) => (
          <View style={styles.listItem}>
            <Text style={styles.monthText}>{moment(item.date).format('YYYY년 MM월 DD일')}</Text>
            <Text style={styles.profitText}>{item.total_sales}원</Text>
          </View>
        );

  const renderMonthlyItem = ({ item }: { item: SalesMonthlyData }) => (
    <View style={styles.listItem}>
      <Text style={styles.monthText}>{moment(item.month).format('YYYY년 MM월 DD일')}</Text>
      <Text style={styles.profitText}>{item.total_sales}원</Text>
    </View>
  );

  const render1MonthSales =  () => (
      <View style={styles.Container}>
           <Text style={styles.title}>지난 한달 매출</Text>
            <View style={{marginTop:RFPercentage(5), marginHorizontal:RFPercentage(0.5), alignSelf:'center'}} >
                      {/* react-native-svg-charts의 LineChart 컴포넌트를 사용하여 차트를 렌더링합니다. */}
                      <LineChart
                        data={chartData}
                        width={Dimensions.get('window').width - RFPercentage(10)} // Adjust width as needed
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
            </View>
            <TouchableOpacity
                        onPress={() => {
                          console.log('지난 1달 매출 차트 클릭');
                          setModalSales(true);
                        }}
                        style={styles.saveButton}>
                        <Text style={styles.buttonText}>상세 데이타</Text>
            </TouchableOpacity>
      </View>
  );


  const renderMonthlySales =  () => (
    <View style={styles.Container}>
         <Text style={styles.title}>월별 매출</Text>

         <BarChart
                data={salesMonthly.map((item, index) => ({
                  label: moment(item.month).format('MMM'),
                  value: Number(item.total_sales),
                  frontColor: index % 2 === 0 ? "green" : "blue", // 짝수 인덱스는 녹색, 홀수 인덱스는 파란색
                  // topLabelComponent: () => (
                  //   <Text style={{ fontSize: 10, color: "black" }}>
                  //     {(item.netProfit / 1000).toFixed(1)}k
                  //   </Text>
                  // ),
                }))}
                width={Dimensions.get('window').width - RFPercentage(15)}
                barWidth={RFPercentage(2)}
                frontColor="green"
                spacing={10}
                noOfSections={5}
                yAxisThickness={0}
                xAxisLabelTextStyle={{ fontSize: 10, color: "black" }}
                // showValuesAsTopLabel={true}
                maxValue={10000}
                formatYLabel = {(label:string)=> Math.round(parseFloat(label) / 1000.0).toString()}
                yAxisLabelWidth={30}
                yAxisLabelSuffix="k" // Add prefix to y-axis labels if neede

            />

          <TouchableOpacity
                      onPress={() => {
                        console.log('월별  매출 차트 클릭');
                        setModalMonthly(true);
                      }}
                      style={styles.saveButton}>
                      <Text style={styles.buttonText}>상세 데이타</Text>
          </TouchableOpacity>
    </View>
);


  const renderLists = () => (
        <FlatList
          ListHeaderComponent={
            <>
              {render1MonthSales()}
              {renderMonthlySales()}
            </>
          }
          data={[]} // 빈 데이터 배열
          renderItem={() => null} // 빈 렌더링 함수
        />
      );

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

      {loading ? (
              <LoadingWheel />
            ) : (
              <>
                  {renderLists()}
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalSales}
                    onRequestClose={() => setModalSales(false)}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        {/* 총 매출 표시 */}
                        <Text style={styles.totalSalesText}>
                            총 매출: {salesData.reduce((sum, item) => sum + Number(item.total_sales), 0).toLocaleString()}원
                        </Text>

                        <View style={styles.subtitleHeader}>
                              <Text style={styles.titleDate}>날짜</Text>
                              <Text style={styles.titleRevenue}>매출</Text>
                        </View>
                        <FlatList
                            data={salesData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.date!}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={
                              <Text style={styles.emptyMessage}> 리스트 없음.</Text>
                            }
                        />
                        <Button title="닫기" onPress={() => setModalSales(false)} />
                      </View>
                    </View>
                  </Modal>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalMonthly}
                    onRequestClose={() => setModalMonthly(false)}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        {/* 총 매출 표시 */}
                        <Text style={styles.totalSalesText}>
                            총 매출: {salesMonthly.reduce((sum, item) => sum + Number(item.total_sales), 0).toLocaleString()}원
                        </Text>

                        <View style={styles.subtitleHeader}>
                              <Text style={styles.titleDate}>날짜</Text>
                              <Text style={styles.titleRevenue}>월별 매출</Text>
                        </View>
                        <FlatList
                            data={salesMonthly}
                            renderItem={renderMonthlyItem}
                            keyExtractor={(item) => item.month!}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={
                                          <Text style={styles.emptyMessage}> 리스트 없음.</Text>
                                        }
                        />
                        <Button title="닫기" onPress={() => setModalMonthly(false)} />
                      </View>
                    </View>
                  </Modal>
              </>
        )}

      {/* <View style={styles.VStack}>
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
                  <Text style={styles.buttonText}>월별 순매출</Text>
            </TouchableOpacity>

      </View> */}

    </WrapperContainer>
  );
};

export const styles = StyleSheet.create({
  Container: {
    padding: RFPercentage(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'blue',
  },

  modalContainer: {
      flex: 1,
      flexDirection: 'column',
      // width: width * 0.9,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      height: 'auto',
      backgroundColor: 'white',
      padding: RFPercentage(1),
      borderRadius: 10,
      alignItems: 'center',
    },

    totalSalesText: {
      fontSize: RFPercentage(2),
      fontWeight: 'bold',
      color: 'black',
      marginBottom: RFPercentage(0.5),
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  subtitleHeader: {
    flexDirection: 'row',
    width: width * 0.7,
    marginTop: RFPercentage(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  titleDate: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  titleRevenue: {
    marginLeft: RFPercentage(20),
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
  },
  listContainer: {
    marginTop: RFPercentage(0.1),
    paddingHorizontal: RFPercentage(2),
    paddingBottom: RFPercentage(5),
  },
  listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: RFPercentage(1),
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
      },
  monthText: {
    fontSize: RFPercentage(2),
    color: colors.black,
    marginRight: RFPercentage(4),
  },
  profitText: {
    fontSize: RFPercentage(2),
    color: colors.black,
    fontWeight: 'bold',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  saveButton: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    margin: RFPercentage(2),
    paddingVertical: RFPercentage(0.5),
    paddingHorizontal: RFPercentage(4),
    borderRadius: RFPercentage(1),
  },
  buttonText: {
      fontWeight: 'bold',
      fontSize: RFPercentage(2),
      color: colors.white,
    },
});

export default SalesMainScreen;
