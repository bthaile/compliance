import React, { createContext, useEffect, useState, useContext } from 'react';
import WebSocketManager from './WebSocketManager';
import createPubSub, { PubSub } from 'pub-sub-es';

export interface WebSocketContext {

}

import { Event } from 'pub-sub-es';

const WebSocketContext = createContext<{ manager: WebSocketManager | null; pubSub: PubSub<Event<string, unknown>> } | null>(null);

interface IProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const WebSocketProvider = (props: IProviderProps) => {
  const [manager, setManager] = useState<WebSocketManager | null>(null);
  const [pubSub] = useState(() => createPubSub({
    async: true,
    caseInsensitive: true,
  }));

  useEffect(() => {
    // Ensure WebSocket is only initialized client-side
    if (typeof window !== 'undefined') {
      const wsManager = new WebSocketManager(
        process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
        'wss://wss.terravalue.net:8089', pubSub);
      setManager(wsManager);

      return () => {
        wsManager.close();
      };
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ manager, pubSub }}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export const usePubSub = (): any => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('usePubSub must be used within a WebSocketProvider');
  }
  return context.pubSub;
};
