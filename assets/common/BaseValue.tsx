import {Dimensions} from 'react-native';
import strings from '../../constants/lang';

export const {width, height} = Dimensions.get('window');

// CategoryFilter.tsx :
export const ALL_CATEGORY_SELECT = -1;
export const CATEGORY_BOX_WIDTH = width * 0.9;

export const Plasma_english = 'Plasma';
export const Ion_english = 'Ion';
export const Sterilize_english = 'Sterilize';

export const OZS_ACTION_EN: string[] = [
  '기본 모드',
  'Plasma',
  'Sterilization',
  'Ion',
  'Plasma decomposition',
];

export const OZS_ACTION_KR: string[] = [
  '기본 모드',
  '플라즈마',
  '살균',
  '음이온',
  '플라즈마 분해',
];

// 2023-06-30  이용 약관 및 개인정보
export const USAGE_TERM_ID = '1';
export const PERSONAL_INFO_ID = '2';
export const COMPANY_INFO_ID = '3';

// 2024-11-19  OZA 이용 약관 및 개인정보
export const OZS_USAGE_TERM_ID = '5';
export const OZS_PRIVACY_AGREEMENT_ID = '6';

// 2024-11-19  OZA 이용 약관 및 개인정보
export const OZS_USAGE_TERM_EN_ID = '7';
export const OZS_PRIVACY_AGREEMENT_EN_ID = '8';

export const LOGIN_NO_EXIST_EMAIL = 400;
export const LOGIN_ALREADY_EXIST_EMAIL = 400;
export const LOGIN_PASSWORD_ERROR = 401;

// 2024-12-30 : chatting 매니저 등록 id
export const MANAGER_ID = '2f6404d2-d095-4ee7-b908-1806937456c6';
export const MANAGER_NICKNAME = 'MANAGER';
