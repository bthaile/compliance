import { User } from 'firebase/auth';

export interface AuthState {
  authUser: User | null;
  isLoading: boolean;
}

export enum AuthActions {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SIGNUP = 'SIGNUP',
  FORGOT = 'FORGOT',
}

interface AuthActionLogin {
  type: AuthActions.LOGIN;
  payload: { name: string, user: User};
}
interface AuthActionLogout {
  type: AuthActions.LOGOUT;
}
interface AuthActionSignUp {
  type: AuthActions.SIGNUP;
  payload: { name: string; email: string; password: string };
}
interface AuthActionForgot {
  type: AuthActions.FORGOT;
  payload: { email: string };
}

export type AuthActionTypes =
  | AuthActionLogin
  | AuthActionLogout
  | AuthActionSignUp
  | AuthActionForgot;
