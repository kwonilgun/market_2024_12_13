import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from '../../../utils/isEmpty';

/**
 * Fetches the FCM token and stores it in AsyncStorage.
 */
export const getFcmToken = async (): Promise<void> => {
  try {
    const fcmToken: string | null = await messaging().getToken();
    console.log('services: getFcmToken : fcmToken =', fcmToken);

    if (fcmToken && !isEmpty(fcmToken)) {
      // Save the token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    } else {
      console.log('services: getFcmToken : firebase token이 없다.');
    }
  } catch (error) {
    console.error('services : getFcmToken :  error =', error);
  }
};
