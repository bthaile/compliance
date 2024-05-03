import { createContext, Dispatch } from 'react';
import { AuthActionTypes, AuthState } from './types';

const noop: Dispatch<AuthActionTypes> = () => {};

const emptyStore = {
  authUser: null,
  isLoading: true,
};

export interface AuthContext {
  store: AuthState;
  dispatch: React.Dispatch<AuthActionTypes>;
}

export const AuthContext = createContext<AuthContext>({
  dispatch: noop,
  store: emptyStore,
});
