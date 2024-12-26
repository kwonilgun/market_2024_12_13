import {alertMsg} from '../../utils/alerts/alertMsg';
import {getToken} from '../../utils/getSaveToken';
import axios, {AxiosResponse} from 'axios';
import {baseURL} from '../../assets/common/BaseUrl';
import strings from '../../constants/lang';

const deleteOrder = async (id: string, props: any) => {
  console.log(' deleteOrder');
  //   const orderList = props.route.params.orders;

  // token을 가져온다.
  try {
    const token = await getToken();
    const response: AxiosResponse = await axios.delete(
      `${baseURL}orders/${id}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    if (response.status === 200) {
      //  const deletedSubtitle = orderList[0].subtitle.filter(
      //    (item: any) => item.id !== id,
      //  );

      //  // OrderList를 업데이트하여 리스트를 다시 로드할 수 있음
      //  console.log('OrderDelete : newList', deletedSubtitle);

      //  orderList[0].isExpanded = false;
      //  orderList[0].subtitle = deletedSubtitle;
      //  console.log('OrderDelete : 삭제된 orderList', orderList);

      alertMsg('success', '주문을 성공적으로 삭제함');
      //  props.navigation.navigate('UserMain', {screen: 'ProfileScreen'});
    }
  } catch (error) {
    alertMsg(strings.ERROR, '삭제 실패함');
  }
};

export default deleteOrder;
