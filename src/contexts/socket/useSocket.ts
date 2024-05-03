import { SocketContext } from './socketContext';
import { useMemo, useContext } from 'react';

export const useSocket = () => {
  const context = useContext(SocketContext);
  const result = useMemo(() => context, [context]);
  return result;
};

export default useSocket;
