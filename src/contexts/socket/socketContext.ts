import { createContext, Dispatch } from 'react';
import Socket from 'simple-websocket';
import { SocketActionTypes, SocketState } from './types';

const noop: Dispatch<SocketActionTypes> = () => {};

const emptyStore = {
  socket: new Socket(
    process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
      'wss://wss.terravalue.net:8089',
  ),
  secondSocket: new Socket(
    process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
      'wss://wss.terravalue.net:8089',
  ),
  isConnected: false,
  crp: null,
  crpCalendar: null,
  mapPins: null,
};

export interface SocketContext {
  store: SocketState;
  dispatch: React.Dispatch<SocketActionTypes>;
}

export const SocketContext = createContext<SocketContext>({
  dispatch: noop,
  store: emptyStore,
});
