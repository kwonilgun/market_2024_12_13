import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {AdminOrderStackParamList} from '../../Screen/model/types/TAdminOrderNavigator';
import AdminOrderMainScreen from '../../Screen/Admin/Order/AdminOrderMainScreen';
import OrderStatusScreen from '../../Screen/Admin/Order/OrderStatusScreen';
import OrderRxScreen from '../../Screen/Admin/Order/OrderRxScreen';
import PaymentCompleteScreen from '../../Screen/Admin/Order/PaymentCompleteScreen';
import OrderDetailScreen from '../../Screen/Orders/OrderDetailScreen';
import PrepareDeliveryScreen from '../../Screen/Admin/Order/PrepareDeliveryScreen';
import FindOrderNumberScreen from '../../Screen/Admin/Order/FindOrderNumberScreen';

// 2024-02-14 : 버그 Fix, RootStackParamList 를 추가함. 타입을 지정
const Stack = createStackNavigator<AdminOrderStackParamList>();

function MyStack() {
    // const {state} = useAuth();
    return (
      <Stack.Navigator
        initialRouteName="AdminOrderMainScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#e6efd0',
            height: 30,
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            // fontWeight: "bold",
            color: 'black',
          },
        }}>
        {/* 2024-05-02 : 하단 탭 메뉴에서 로그인 탭을 눌러도 그대로 있도록 하기 위해서 로그인 상태를 체크해서, 로그인 상태이면 ProfileScreen을 유지 */}

          <Stack.Screen
            name="AdminOrderMainScreen"
            component={AdminOrderMainScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '주문',
            })}
          />

        <Stack.Screen
            name="OrderStatusScreen"
            component={OrderStatusScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '주문현황',
            })}
          />

        <Stack.Screen
            name="OrderRxScreen"
            component={OrderRxScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '주문접수',
            })}
          />
        <Stack.Screen
            name="PaymentCompleteScreen"
            component={PaymentCompleteScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '결재완료',
            })}
          />

          <Stack.Screen
            name="OrderDetailScreen"
            component={OrderDetailScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '결재완료',
            })}
          />

          <Stack.Screen
            name="PrepareDeliveryScreen"
            component={PrepareDeliveryScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '배송준비',
            })}
          />

          <Stack.Screen
            name="FindOrderNumberScreen"
            component={FindOrderNumberScreen}
            options={({navigation, route}) => ({
              headerShown: false,
              headerLeft: () => null,
              title: '주문번호 찾기',
            })}
          />

      </Stack.Navigator>
    );
  }
  export default function UserNavigator() {
    return <MyStack />;
  }
