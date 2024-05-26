import React, { useEffect, useReducer } from 'react';
import 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import firebase from './Firebase';
import { useRouter } from 'next/router';

import { AuthContext } from './AuthContext';
import { AuthActions, AuthActionTypes, AuthState } from './types';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { CHART_TOPICS, makeTopicRequest } from 'contexts/socket/PubSubTopics';

const initialState: AuthState = {
  authUser: null,
  isLoading: true,
};

const auth = getAuth(firebase);

interface IProviderProps {
  children: JSX.Element | JSX.Element[];
}

const reducer = (
  state: AuthState = initialState,
  action: AuthActionTypes,
): AuthState => {
  switch (action.type) {
    case AuthActions.LOGIN: {
      const { user, name } = action.payload;
      console.log(name);
      console.log('adding authuser', user)
      return { ...state, isLoading: false, authUser: { ...user } };
    }
    case AuthActions.LOGOUT: {
      signOut(auth).catch((err) => {
        console.log(err);
      });
      return state;
    }
    case AuthActions.SIGNUP: {
      const { email, password } = action.payload;
      createUserWithEmailAndPassword(auth, email, password).catch((err) => {
        console.log(err);
      });
      return state;
    }
    case AuthActions.FORGOT: {
      const { email } = action.payload;
      sendPasswordResetEmail(auth, email).catch((err) => {
        console.log(err);
      });
      return state;
    }
    default:
      return state;
  }
};

export const AuthProvider = (props: IProviderProps) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const subPub = usePubSub();

  useEffect(() => {
    if (store?.authUser) {
      if (store?.authUser?.uid) {
        subPub.publish(makeTopicRequest(CHART_TOPICS.PICKLIST_DATA), { topic: CHART_TOPICS.PICKLIST_DATA, payload: { uid: store.authUser?.uid } });
        subPub.publish(makeTopicRequest(CHART_TOPICS.LENDERS_DATA), { topic: CHART_TOPICS.LENDERS_DATA, payload: { uid: store.authUser?.uid } });
      }
    }
  }, [store?.authUser]);

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      return auth.signOut();
    };

    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        if (router.pathname !== '/login') router.push('/login');
      } else {
        if (router.pathname === '/login') router.push('/');
      }
    });

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
    }
  });

  return (
    <AuthContext.Provider value={{ store, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};
