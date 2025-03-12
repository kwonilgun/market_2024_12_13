/* eslint-disable no-sequences */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

import isEmpty from '../../utils/isEmpty';
import {dateToKoreaDate, dateToKoreaTime} from '../../utils/time/dateToKoreaTime';
import {DataList, DataListItem} from './makeExpandable';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ExpandableProps {
  navigation: any;
  item: DataListItem;
  onClickFunction: () => void;
  actionFt: (id: string, props: any) => void;
  orders: DataList;
}

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
        <View style={styles.subtitleHeader}>
           <Text style={[styles.receiverName, {marginRight:RFPercentage(6)}]}>수신자</Text>
           <Text style={[{marginRight:RFPercentage(7)}]}>주문날짜</Text>
           <Text style={[{marginRight:RFPercentage(6)}]}>주문번호</Text>
        </View>
        {!isEmpty(item.subtitle) ? (
          item.subtitle.map((data, key) => (
            // console.log('Expandable receiver name = ');
            <TouchableOpacity
              key={key}
              onPress={() => {
                console.log('Expandable.tsx : 주문 상세 정보 누름');
                navigation.navigate('AdminOrder', {
                  screen: 'OrderDetailScreen',
                  params: {
                    item: data,
                    actionFt: actionFt,
                    orders: orders,
                  },
                });
              }}>
              <View style={styles.subtitleContainer}>
                <Text style={[styles.receiverName, styles.flexItem]}>{data.receiverName} :</Text>
                <Text style={[styles.dateOrdered, styles.flexItem]}>
                  {' '}
                  {dateToKoreaDate(new Date(data.dateOrdered))}</Text>
                <Text style={[styles.orderNumber, styles.flexItem]}>
                  {' '}
                  {data.orderNumber}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>데이타 없음</Text>
        )}
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
    marginLeft: RFPercentage(3),
    // justifyContent: 'center',
    marginVertical: 4,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  subtitleContainer: {
    flexDirection: 'row',
    // marginLeft: RFPercentage(3),
    marginVertical: 4,
  },
  flexItem: {
    flex: 1, // 각 항목이 동일한 너비를 가지도록 설정
    // textAlign: 'center', // 가운데 정렬
  },
  receiverName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1, // 동일한 너비 유지
    textAlign: 'center',
  },
  dateOrdered: {
    // marginLeft: RFPercentage(2),
    fontSize: 14,
    color: '#555',
    flex: 1,
    textAlign: 'center', // 중앙 정렬
  },
  orderNumber: {
    // marginLeft: RFPercentage(2),
    fontSize: 14,
    color: '#555',
    flex: 1,
    textAlign: 'left', // 오른쪽 정렬
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 8,
  },
});
