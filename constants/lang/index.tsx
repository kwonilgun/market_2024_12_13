import LocalizedStrings from 'react-native-localization';
import kr from './kr';
import en from './en';

//참조 사이트 : https://www.educative.io/answers/how-to-localize-a-react-native-application

let strings = new LocalizedStrings({
  kr,
  en,
});

export default strings;
