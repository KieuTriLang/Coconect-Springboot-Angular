import { INotiType } from './noti-type';
export interface INotiItem {
  type: INotiType;
  content: string;
  roomCode: string;
  roomName: string;
  status: string;
  time: string;
}
