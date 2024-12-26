import {CartItem} from '../../../Redux/Cart/Reducers/cartItems';

export interface IOrderInfo {
  id: string;
  address1: string;
  address2: string;
  buyerName: string;
  buyerPhone: string;
  dateOrdered: string;
  deliveryMethod: number;
  isPaid: boolean;
  orderItems: CartItem;
  orderNumber: string;
  orderPrice: number;
  producerName: string;
  producerPhone: string;
  realPayment: number;
  receiverName: string;
  receiverPhone: string;
  status: string;
  user: string;
}
