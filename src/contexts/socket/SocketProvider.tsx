import React, { useReducer } from 'react';
import { ICRPCalendar, ILoadCRP, ILoadMapPins } from 'services/types';
import Socket from 'simple-websocket';
import { v4 } from 'uuid';

import { SocketContext } from './socketContext';
import { SocketActions, SocketActionTypes, SocketState } from './types';

const initialState: SocketState = {
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

interface IProviderProps {
  children: JSX.Element | JSX.Element[];
}

const reducer = (
  state: SocketState = initialState,
  action: SocketActionTypes,
): SocketState => {
  switch (action.type) {
    case SocketActions.UPDATE_CONNECTION_STATUS: {
      const { isConnected } = action.payload;
      return { ...state, isConnected: isConnected };
    }
    case SocketActions.LOAD_CRP_CALENDAR: {
      const { crpCalendar } = action.payload;
      return { ...state, crpCalendar: crpCalendar };
    }

    default:
      return state;
  }
};

export const SocketProvider = (props: IProviderProps) => {
  const [store, dispatch] = useReducer(reducer, initialState);

  if (!Socket.WEBSOCKET_SUPPORT) {
    console.log('websockets are not supported');
  }

  store.socket.on('error', (data) => {
    console.log('Websocket Error: ', data);
  });
  store.secondSocket.on('error', (data) => {
    console.log('Websocket Error: ', data);
  });

  store.secondSocket.on('connect', () => {
    dispatch({
      type: SocketActions.UPDATE_CONNECTION_STATUS,
      payload: { isConnected: true },
    });

    store.secondSocket.send(
      JSON.stringify({
        id: v4().replace(/-/g, ''),
        status: 'LOAD_CRP_CALENDAR',
        // TODO: Use ID provided by firebase
        userId: 'rWeTz6hDchcDlqzmtidBgIHdTNE2',
        payload: Date.now(),
      }),
    );
    store.secondSocket.on('data', (data: Uint8Array) => {
      const dataString = new TextDecoder('utf-8').decode(data);
      const json: { status: string; payload: ICRPCalendar[] } = JSON.parse(
        dataString,
      ) as { status: string; payload: ICRPCalendar[] };
      if (json.status === 'LOAD_CRP_CALENDAR') {
        console.log(Date.now());
        dispatch({
          type: SocketActions.LOAD_CRP_CALENDAR,
          payload: { crpCalendar: json.payload },
        });
      }
    });
  });

  return (
    <SocketContext.Provider value={{ store, dispatch }}>
      {props.children}
    </SocketContext.Provider>
  );
};
