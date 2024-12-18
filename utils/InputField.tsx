// InputField.tsx

import React from 'react';
import {Controller} from 'react-hook-form';
import {
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
// import {RFPercentage} from 'react-native-responsive-fontsize';

// import {height, width} from '../assets/common/BaseValue';
import GlobalStyles from '../styles/GlobalStyles';

interface InputFieldProps {
  control: any; // You can replace 'any' with the appropriate type for your control
  rules: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
  };
  name: string;
  placeholder: string;
  keyboard: KeyboardTypeOptions;
  isEditable?: boolean;
  isPassword?: boolean;
  defaultValue?: string;
}

const InputField = ({
  control,
  rules,
  name,
  placeholder,
  keyboard,
  isEditable = true,
  isPassword = false,
}: // defaultValue = '',
InputFieldProps) => {
  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={GlobalStyles.textInputField}
            placeholder={placeholder}
            placeholderTextColor={'grey'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType={keyboard}
            editable={isEditable} // 추가: 사용자가 입력 가능한지 여부 설정
            secureTextEntry={isPassword} // Use secureTextEntry based on isPassword
            // defaultValue={defaultValue} // 추가: 초기 값 설정
          />
        )}
        name={name}
      />
    </>
  );
};

// const styles = StyleSheet.create({
//   input: {
//     height: Platform.OS === 'android' ? 'auto' : height * 0.05,
//     width: width * 0.75,
//     margin: RFPercentage(1),
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderColor: 'black',
//     borderRadius: 5,
//     fontSize: RFPercentage(1.8),
//     fontWeight: 'bold',
//   },
// });

export default InputField;
