import React from 'react';
import {TouchableOpacity} from 'react-native';
import ProductCard from './ProductCard';
import {StackNavigationProp} from '@react-navigation/stack';
import {IProduct} from '../model/interface/IProductInfo';
import {ICompany} from '../model/interface/ICompany';

interface ProductListProps {
  item: IProduct; // Replace 'any' with a specific type for 'item' if available
  companyInform: ICompany; // Replace 'any' with a specific type for 'companyInform' if available
  navigation: StackNavigationProp<any, any>; // Update types based on your navigation stack
}

const ProductList: React.FC<ProductListProps> = props => {
  const {item, companyInform, navigation} = props;

  return (
    <TouchableOpacity
      // style={{ width: '50%' }}
      onPress={() => {
        navigation.navigate('ProductDetailScreen', {
          item: item,
          companyInform: companyInform,
        });
      }}>
      <ProductCard navigation={navigation} items={item} {...item} />
    </TouchableOpacity>
  );
};

export default ProductList;
