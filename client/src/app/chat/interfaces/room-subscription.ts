import { Subscription } from 'stompjs';

export interface IRoomSubscription {
  roomCode: string;
  subscription: Subscription;
}
