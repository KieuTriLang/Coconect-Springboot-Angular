import { INotiType } from './noti-type';
export interface INotiItem {
  type: INotiType;
  content: string;
  time: string;
  read: boolean;
}
