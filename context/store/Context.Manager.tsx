import React, {createContext, useReducer, useContext, ReactNode} from 'react';

import {
  initialStateNotification,
  notificationAction,
  notificationReducer,
  notificationState,
} from './Notification.Context';
// 2024-05-04 : Ozs Running state 추가
// 2024-06-26 : Badge Count state 추가
import {
  initialStateBadgeCount,
  BadgeCountAction,
  badgeCountReducer,
  BadgeCountState,
} from './BadgeCount.Context';

import {
  AuthState,
  authReducer,
  AuthAction,
  initialAuthState,
} from './Auth.Login';

// Context 생성
const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<AuthAction>;

      notifyState: notificationState;
      notifyDispatch: React.Dispatch<notificationAction>;

      badgeCountState: BadgeCountState;
      badgeCountDispatch: React.Dispatch<BadgeCountAction>;
    }
  | undefined
>(undefined);

// AuthProvider 컴포넌트
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [notifyState, notifyDispatch] = useReducer(
    notificationReducer,
    initialStateNotification,
  );
  const [badgeCountState, badgeCountDispatch] = useReducer(
    badgeCountReducer,
    initialStateBadgeCount,
  );

  return (
    <AuthContext.Provider
      value={{
        // login
        state,
        dispatch,
        // notification
        notifyState,
        notifyDispatch,
        // ozsRunning
        badgeCountState,
        badgeCountDispatch,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export {AuthProvider, useAuth};
