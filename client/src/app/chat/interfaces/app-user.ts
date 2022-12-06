import { ITab } from './tab';

export interface AppUser {
  userCode: string;
  username: string;
  conversations: ITab[] | [];
}
