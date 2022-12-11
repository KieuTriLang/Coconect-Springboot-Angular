import { INotiType } from './noti-type';
export interface INotiItem {
  type: INotiType;
  content: string;
  roomCode: string;
  status: string;
  time: string;
}
