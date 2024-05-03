import '../styles/globals.css';
import '../styles/react-big-calendar.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from 'contexts/auth/AuthProvider';
import { SocketProvider } from 'contexts/socket/SocketProvider';
import { WebSocketProvider } from 'contexts/socket/WebSocketProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider>
      <SocketProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SocketProvider>
    </WebSocketProvider>
  );
}

export default MyApp;
