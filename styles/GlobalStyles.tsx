import {StyleSheet, Platform, StatusBar} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize'; // 필요 시 추가
import colors from './colors'; // 필요한 경우 colors 파일 임포트
import {height, width} from '../assets/common/BaseValue';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  containerKey: {
    flex: 1,
  },
  scrollView: {
    // backgroundColor: 'white',
  },
  VStack: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: RFPercentage(3),
    justifyContent: 'flex-start',
  },
  HStack: {
    flex: 1,
    marginRight: RFPercentage(1),
  },
  HStack_PASSWORD: {
    margin: RFPercentage(1),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  HStack_LOGIN: {
    flex: 1,
    marginTop: RFPercentage(1),
    marginRight: 10,
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HStack_LOGO: {
    flex: 1,
    marginTop: RFPercentage(1.0),
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: RFPercentage(20),
    height: RFPercentage(20),
    // marginBottom: RFPercentage(1),
  },
  inputMember: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.0),
    margin: 10,
    padding: 2,
    color: colors.grey,
  },
  totalInput: {
    margin: RFPercentage(1),
  },
  inputTitle: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
    color: 'black',
    marginTop: RFPercentage(1),
  },
  passwordText: {
    textDecorationLine: 'underline',
    fontSize: RFPercentage(1.8),
    color: 'black',
  },
  icon: {
    position: 'absolute',
    right: -15,
    top: '55%',
    transform: [
      {
        translateY:
          Platform.OS === 'android'
            ? -((height * 0.04) / 2)
            : -((height * 0.05) / 2),
      },
    ],
  },
  errorMessage: {
    color: 'red',
    height: height * 0.04,
    margin: RFPercentage(1),
    fontSize: RFPercentage(2.6),
    fontWeight: 'bold',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  iosCheckbox: {
    color: 'black',
    width: RFPercentage(4),
    height: RFPercentage(4),
    //     borderColor: 'black',
    //     borderWidth: 2,
  },
  androidCheckbox: {
    transform: [{scale: 1.6}],
    //     color: 'blue',
    width: RFPercentage(5),
    height: RFPercentage(5),
    margin: RFPercentage(1),
  },
  textInputField: {
    height: Platform.OS === 'android' ? 'auto' : height * 0.05,
    width: width * 0.75,
    margin: RFPercentage(1),
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: 'black',
    borderRadius: 5,
    fontSize: RFPercentage(1.8),
    fontWeight: 'bold',
  },
  privacyCheckBoxText: {
    margin: RFPercentage(1),
    fontSize: RFPercentage(2),
    color: 'black',
  },
  privacyCheckBoxSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  usageText: {
    margin: RFPercentage(2),
    padding: RFPercentage(1),
    textDecorationLine: 'underline',
    fontSize: RFPercentage(2),
    color: 'black',
  },
  privacyText: {
    marginHorizontal: RFPercentage(2),
    padding: RFPercentage(1),
    textDecorationLine: 'underline',
    fontSize: RFPercentage(2),
    color: 'black',
  },

  buttonTextStyle: {
    fontWeight: 'bold',
    fontSize: RFPercentage(3), // Adjust the percentage based on your design
    color: colors.white,
  },
  buttonStyle: {
    width: 'auto',
    height: 'auto',
    marginHorizontal: RFPercentage(0.3),
    // paddingHorizontal: RFPercentage(0.5),
  },
  buttonViewText: {
    marginTop: RFPercentage(4),
    // marginHorizontal: RFPercentage(3),
    height: RFPercentage(8),
    padding: RFPercentage(2),
    flexDirection: 'row',
    justifyContent: 'center',
    // alignContent: 'space-between',
    alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 1,
    backgroundColor: colors.blue,
    borderRadius: 5,
  },
});

export default GlobalStyles;
