import { ICRPCalendar, ILoadCRP, ILoadMapPins } from 'services/types';
import Socket from 'simple-websocket';

export interface SocketState {
  socket: Socket;
  secondSocket: Socket;
  isConnected: boolean;
  crp: ILoadCRP[] | null;
  crpCalendar: ICRPCalendar[] | null;
  mapPins: ILoadMapPins[] | null;
}

export enum SocketActions {
  UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS',
  LOAD_CRP = 'LOAD_CRP',
  LOAD_CRP_CALENDAR = 'LOAD_CRP_CALENDAR',
  ADD_MAP_PINS = 'ADD_MAP_PINS',
}

interface SocketActionUpdateConnectionStatus {
  type: SocketActions.UPDATE_CONNECTION_STATUS;
  payload: { isConnected: boolean };
}
interface SocketActionLoadCrp {
  type: SocketActions.LOAD_CRP;
  payload: { crp: ILoadCRP[] };
}
interface SocketActionLoadCrpCalendar {
  type: SocketActions.LOAD_CRP_CALENDAR;
  payload: { crpCalendar: ICRPCalendar[] };
}

interface SocketActionLoadMapPins {
  type: SocketActions.ADD_MAP_PINS;
  payload: { mapPins: ILoadMapPins[] };
}

export type SocketActionTypes =
  | SocketActionUpdateConnectionStatus
  | SocketActionLoadCrp
  | SocketActionLoadCrpCalendar
  | SocketActionLoadMapPins;
