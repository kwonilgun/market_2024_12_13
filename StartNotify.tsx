// import {useEffect} from 'react';

// import {getFcmToken} from './Screen/Chat/notification/services';
// // import {
// //   // displayNotification,
// //   initializeNotificationChannel,
// // } from './Screen/Chat/notification/displayNotification';

// import {firebase} from '@react-native-firebase/app';
// import messaging from '@react-native-firebase/messaging';
// import {Alert, Platform} from 'react-native';
// import {
//   displayNotification,
//   // initializeNotificationChannel,
// } from './Screen/Chat/notification/displayNotification';

// import notifee, {EventType} from '@notifee/react-native';

// const StartNotify: React.FC = () => {
//   useEffect(() => {
//     let unsubscribeForegroundMessage: () => void;
//     let unsubscribeBackgroundMessage: void | (() => void);

//     const setupMessaging = async () => {
//       // Request user permission for notifications
//       // try {
//       //   await messaging().requestPermission();
//       // } catch (error) {
//       //   console.error('Error requesting notification permission:', error);
//       //   return; // Important: Exit if permission is denied
//       // }

//       // Get the FCM token
//       if (Platform.OS === 'android') {
//         await getFcmToken(); // Make sure this is awaited
//       }

//       notifee.onForegroundEvent(({type, detail}) => {
//         console.log('Notifee Foreground Event:', type, detail);

//         if (type === EventType.PRESS) {
//           console.log('Notification pressed:', detail.notification);
//         }

//         if (type === EventType.ACTION_PRESS) {
//           console.log('Notification action pressed:', detail.pressAction);
//         }
//       });

//       // initializeNotificationChannel();

//       // Handle foreground messageså
//       unsubscribeForegroundMessage = messaging().onMessage(
//         async remoteMessage => {
//           console.log('Foreground FCM Message:', remoteMessage);
//           // Handle the notification in the foreground
//           await displayNotification(remoteMessage);
//         },
//       );

//       // // Set the background message handler
//       // unsubscribeBackgroundMessage = messaging().setBackgroundMessageHandler(
//       //   async remoteMessage => {
//       //     console.log('Message handled in the background!', remoteMessage);
//       //     // IMPORTANT: Process the notification. Do NOT leave this empty.
//       //     // If you don't do anything here, it may lead to crashes.
//       //     await displayNotification(remoteMessage);
//       //     return;
//       //   },
//       // );
//     };

//     // setupMessaging();

//     const initializeMessage = async () => {
//       await setupMessaging(); // setupMessaging() 작업 완료
//       console.log('initializeMessage');
//     };

//     initializeMessage();

//     return () => {
//       // Correctly unsubscribe from listeners
//       if (unsubscribeForegroundMessage) {
//         console.error('unsubscribe foreground');
//         unsubscribeForegroundMessage();
//       }
//       if (unsubscribeBackgroundMessage) {
//         unsubscribeBackgroundMessage();
//       }

//       console.log('Cleaning up FCM handlers');
//     };
//   }, []);

//   return null;
// };

// export default StartNotify;
