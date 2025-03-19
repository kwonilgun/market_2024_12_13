/* eslint-disable no-sequences */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, TouchableOpacity, Text, StyleSheet, ScrollView, Alert} from 'react-native';

import isEmpty from '../../utils/isEmpty';
import {dateToKoreaDate, dateToKoreaTime} from '../../utils/time/dateToKoreaTime';
import {DataList, DataListItem} from './makeExpandable';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Picker } from '@react-native-picker/picker';

interface ExpandableProps {
  navigation: any;
  item: DataListItem;
  onClickFunction: () => void;
  actionFt: (id: string, props: any) => void;
  orders: DataList;
}

const statusMessages: {[key: string]: string} = {
  '1': '주문 접수',
  '2': '결제 완료',
  '3': '배송 준비',
  '4': '배송 중',
  '5': '배송 완료',
  '6': '반품 요청',
  '7': '반품 완료',
};

export const AdminExpandable: React.FC<ExpandableProps> = ({
  navigation,
  item,
  onClickFunction,
  actionFt,
  orders,
}) => {
  const [layoutHeight, setLayoutHeight] = useState<number | null>(0);

  useFocusEffect(
    useCallback(() => {
      console.log('AdminExpandable: useFocusEffect : 진입을 한다. .<<<<<');
      if (item.isExpanded) {
        setLayoutHeight(null);
      } else {
        setLayoutHeight(0);
      }
    }, [item.isExpanded]),
  );


   // 첫 번째 수신자와 주문번호를 가져옵니다.
  //  const firstSubtitle = !isEmpty(item.subtitle) ? item.subtitle[0] : null;

  const handleItemPress = (data: any) => {
    Alert.alert(
      '선택',
      '어떤 작업을 하시겠습니까?',
      [
        {
          text: '상세 정보 보기',
          onPress: () => {
            navigation.navigate('AdminOrder', {
              screen: 'OrderDetailScreen',
              params: {
                item: data,
                actionFt: actionFt,
                orders: orders,
              },
            });
          },
        },
        {
          text: '주문 상태 변경',
          onPress: () => {
            console.log('주문상태변경');
            navigation.navigate('AdminOrder', {
              screen: 'OrderChangeScreen',
              params: {
                item: data,
                actionFt: actionFt,
                orders: orders,
              },
            });
          },
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  


  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={onClickFunction}>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'column'}}>

            <View style={styles.subtitleHeader}>
              <Text style={[styles.headerText, {width:RFPercentage(10), borderWidth:1, borderColor: 'black', marginLeft: RFPercentage(2)}]}>수신자</Text>
              <Text style={[styles.headerText, {width:RFPercentage(20), borderWidth:1, borderColor: 'black' }]}>주문날짜</Text>
              <Text style={[styles.headerText, {width:RFPercentage(20), borderWidth:1, borderColor: 'black' }]}>주문번호</Text>
              <Text style={[styles.headerText, {width:RFPercentage(10), borderWidth:1, borderColor: 'black' }]}>주문상태</Text>
              <Text style={[styles.headerText, {width:RFPercentage(20), borderWidth:1, borderColor: 'black' }]}>배송일정</Text>
            </View>
            <View>
            {!isEmpty(item.subtitle) ? (

                item.subtitle.map((data, key) => (
                  // console.log('Expandable receiver name = ');
                  // console.log('delivery method ', data.deliveryMethod? data.deliveryMethod : '' );
                  <TouchableOpacity
                      key={key}
                      onPress={() => handleItemPress(data)}
                  >
                    <View style={styles.subtitleContainer}>
                      <Text style={[styles.receiverName]}>{data.receiverName}</Text>
                      <Text style={[styles.dateOrdered]}>
                        {dateToKoreaDate(new Date(data.dateOrdered))}
                      </Text>
                      <Text style={[styles.orderNumber]}>
                        {data.orderNumber}
                      </Text>
                      <Text style={[styles.orderStatus]}>
                        {statusMessages[data.status.toString()] }
                      </Text>
                      <Text style={[styles.orderNumber]}>
                        { data.deliveryDate === null ? '          미지정          ' : dateToKoreaDate(new Date(data.deliveryDate))}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
                ) : (
                <Text style={styles.noDataText}>데이타 없음</Text>
                )}
            </View>
          </View>
          </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  subtitleHeader: {
    flexDirection: 'row',
    alignItems: 'center',  // 중앙 정렬
    // justifyContent: 'space-between',
    marginVertical: 4,
    // borderBottomWidth: 1,
    // borderColor: 'black',
    // paddingHorizontal: RFPercentage(2),
  },
  subtitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', // 중앙 정렬
    // justifyContent: 'space-between',
    marginVertical: 4,
    paddingHorizontal: RFPercentage(2),
  },
  headerText: {
    // flex: 1, // 동일한 비율 유지
    fontSize: RFPercentage(2),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexItem: {
    flex: 1, // 각 항목이 동일한 너비를 가지도록 설정
    // textAlign: 'center', // 가운데 정렬
  },
  receiverName: {
    width: RFPercentage(10),
    fontSize: RFPercentage(2),
    textAlign: 'center',
    // paddingHorizontal: RFPercentage(1),
    borderColor: 'blue',
    borderWidth: 1,
  },
  dateOrdered: {
    fontSize: RFPercentage(2),
    color: '#555',
    textAlign: 'center',
    // paddingHorizontal: RFPercentage(1),
    width: RFPercentage(20),
    borderColor: 'blue',
    borderWidth: 1,
  },
  orderNumber: {
    fontSize: RFPercentage(2),
    color: '#555',
    textAlign: 'center',
    // paddingHorizontal: RFPercentage(1),
    width: RFPercentage(20),
    borderColor: 'red',
    borderWidth: 1,
  },
  orderStatus: {
    width: RFPercentage(10),
    fontSize: RFPercentage(2),
    color: '#555',
    textAlign: 'center',
    borderColor: 'blue',
    borderWidth: 1,
  },

  noDataText: {
    fontSize: RFPercentage(2),
    color: '#888',
    textAlign: 'center',
    marginVertical: 8,
  },
  
});
