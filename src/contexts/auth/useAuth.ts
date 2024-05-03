import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const { store, dispatch } = useContext(AuthContext);

  return {
    authUser: store.authUser,
    dispatch
  };
};

export default useAuth;
