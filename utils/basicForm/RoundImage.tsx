/* eslint-disable react-native/no-inline-styles */
// Import libraries
import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageStyle,
  StyleProp,
  ImageSourcePropType,
} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {moderateScale, textScale} from '../../styles/responsiveSize';

// Define prop types
interface RoundImageProps {
  image?: string;
  size?: number;
  onPress?: () => void;
  isStatic?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
}

// Create a component
const RoundImage: FC<RoundImageProps> = ({
  image = '',
  size = 80,
  onPress = () => {},
  isStatic = false,
  imageStyle,
}: RoundImageProps) => {
  const compImg = isStatic ? image : {uri: image};

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        height: moderateScale(size),
        width: moderateScale(size),
        borderRadius: moderateScale(size / 2),
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.grey,
        ...(imageStyle as object),
      }}>
      {!!image ? (
        <Image
          style={{
            height: moderateScale(size),
            width: moderateScale(size),
            borderRadius: moderateScale(size / 2),
          }}
          source={compImg as ImageSourcePropType}
        />
      ) : (
        <Text style={styles.textStyle}>add photo</Text>
      )}
    </TouchableOpacity>
  );
};

// Define styles
const styles = StyleSheet.create({
  textStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.blackFont,
    color: colors.lightBlue,
  },
});

// Make this component available to the app
export default RoundImage;
