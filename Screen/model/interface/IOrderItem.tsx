import {IProduct} from './IProductInfo';

export interface IOrderItem {
  product: IProduct;
  quantity: number;
}
