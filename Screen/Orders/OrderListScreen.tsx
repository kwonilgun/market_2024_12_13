/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import {Expandable} from '../../Admin/Shipping/Expandable';
// import {updateLayout} from '../../../Shared/Orders/makeExpandable';
// import {LogoTitle} from '../../../Navigators/LogoTitle';
// import deleteOrder from '../../../Shared/Orders/OrderDelete';

import {RFPercentage} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import isEmpty from '../../utils/isEmpty';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import {OrderListScreenProps} from '../model/types/TUserNavigator';
import {DataList, updateLayout} from './makeExpandable';
import {Expandable} from './Expandable';

const OrderListScreen: React.FC<OrderListScreenProps> = ({
  route,
  navigation,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<DataList>(route.params?.items);

  useEffect(() => {
    if (isEmpty(orders)) {
      console.log('OrderLists: useEffect: 초기화시에 orders가 비어 있다.');
      setLoading(false);
    } else {
      console.log('OrderLists: useEffect: 실행 이후에 orders가 있다.');
      setLoading(false);
    }
    return () => {
      console.log('OrderLists: useEffect : exit 한다.');
      setLoading(true);
    };
  }, [orders]);

  const onPressLeft = () => {
    navigation.navigate('UserMain', {screen: 'ProfileScreen'});
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
        centerText="주문리스트"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />
      <>
        {loading ? (
          <LoadingWheel />
        ) : (
          <>
            <ScrollView>
              <View style={styles.listContainer}>
                {/* <Text style={styles.title}>주문리스트</Text> */}

                {orders
                  ? orders.map((item, index) => {
                      if (!isEmpty(item.subtitle)) {
                        return (
                          <View key={index} style={styles.itemContainer}>
                            <Expandable
                              navigation={navigation}
                              item={item}
                              onClickFunction={() => {
                                updateLayout(index, orders, setOrders);
                              }}
                              actionFt={'deleteOrder'}
                              orders={orders}
                            />
                          </View>
                        );
                      }
                      return null;
                    })
                  : null}
              </View>
            </ScrollView>
          </>
        )}
      </>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
  },
  listContainer: {
    margin: 8,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
});

export default OrderListScreen;