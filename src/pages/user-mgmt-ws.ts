import Socket from 'simple-websocket';
import { v4 } from 'uuid';
import { IParsedResponse } from 'components/GoogleMap/MarkerBlock';
export class WebSocketService {
  socket: Socket;

  constructor(url: string) {
    this.socket = new Socket(url);
  }

  connect() {
    this.socket.on('connect', (data) => {
      console.log('connected');
      this.send({
        id: v4().replace(/-/g, ''),
        status: 'USER_MGMT_LOAD_USER',
        userId: process.env.SOCKET_USER_ID,
        payload: {},
      });
      this.send({
        id: v4().replace(/-/g, ''),
        status: 'USER_MGMT_LOAD_MANAGERS',
        userId: process.env.SOCKET_USER_ID,
        payload: {},
      });
    });
  }

  send(message: object) {
    this.socket.send(JSON.stringify(message));
  }

  onMessage(callback: (data: IParsedResponse) => void) {
    this.socket.on('data', (data: BufferSource | undefined) => {
      const resp = new TextDecoder('utf-8').decode(data);
      const responseJSON: IParsedResponse = JSON.parse(resp) as IParsedResponse;
      callback(responseJSON);
    });
  }
}