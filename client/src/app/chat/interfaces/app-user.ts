import { Room } from './room';

export interface AppUser {
  userCode: string;
  username: string;
  roooms: Room[] | null;
}
