import { AppUser } from './app-user';

export interface Room {
  roomCode: string;
  roomName: string;
  members: AppUser[] | null;
}
