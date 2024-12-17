import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProduct} from '../../../Screen/Products/interface/IProductInfo';
import isEmpty from '../../../utils/isEmpty';

export interface CartItem {
  product: IProduct;
  quantity: number;
  // Add other properties of the CartItem interface as needed
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (isEmpty(state.items)) {
        state.items = [action.payload];
      } else {
        state.items = state.items.filter(
          item => item.product.id !== action.payload.product.id,
        );
        state.items.push(action.payload);
      }
    },

    changeQuantity: (state, action: PayloadAction<CartItem>) => {
      if (isEmpty(state.items)) {
        state.items = [action.payload];
      } else {
        state.items = state.items.map(item =>
          item.product === action.payload.product
            ? {...item, quantity: action.payload.quantity}
            : item,
        );
      }
    },

    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter(
        item => item.product !== action.payload.product,
      );
    },

    clearCart: state => {
      state.items = [];
    },
  },
});

export const {addToCart, changeQuantity, removeFromCart, clearCart} =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;
