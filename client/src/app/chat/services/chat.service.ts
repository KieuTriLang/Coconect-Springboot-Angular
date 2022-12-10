import { IRoomSubscription } from './../interfaces/room-subscription';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { MessageService } from './message.service';
import { UserData } from '../interfaces/user-data';
import { IChatMessage } from '../interfaces/chat-message';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Client, Message, over, Subscription } from 'stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = environment.baseUrl;

  userData: UserData = {
    identityCode: '',
    username: '',
    connected: false,
  };
  stompClient!: Client;

  newMessage = new Subject<IChatMessage>();
  newMessage$ = this.newMessage.asObservable();

  connected = new BehaviorSubject<boolean>(false);
  connected$ = this.connected.asObservable();

  roomSubscriptions: IRoomSubscription[] = [];
  constructor(
    private messageService: MessageService,
    private storageService: StorageService,
    private userService: UserService
  ) {}

  registerUser(userData: UserData) {
    this.userData = userData;
    this.connect();
  }
  connect = () => {
    let sock = new SockJS(`${this.baseUrl}/ws`, null, {});
    this.stompClient = over(sock);
    this.stompClient.connect(
      {
        Authorization:
          'Bearer ' + this.storageService.getTokenFromLocal('cc_access_token'),
      },
      this.onConnected,
      this.onError
    );
  };

  onConnected = () => {
    this.stompClient.subscribe('/chatroom/public', this.onMessageReceived);
    this.stompClient.subscribe(
      '/user/' + this.userData.identityCode + '/private',
      this.onPrivateMessage
    );
    this.connected.next(true);
  };

  subscribeRoom(roomCode: string) {
    this.roomSubscriptions = [
      ...this.roomSubscriptions,
      {
        roomCode: roomCode,
        subscription: this.stompClient.subscribe(
          `/room/${roomCode}`,
          this.onMessageReceived
        ),
      },
    ];
  }
  unsubscribeRoom(roomCode: string) {
    this.roomSubscriptions = this.roomSubscriptions.filter(
      (roomSubscription) => {
        if (roomSubscription.roomCode == roomCode) {
          roomSubscription.subscription.unsubscribe();
          return;
        }
        return roomSubscription;
      }
    );
  }

  onError = (error: any) => {
    console.log(error);
  };

  userJoin() {
    var chatMessage = {
      senderName: this.userData.username,
      status: 'JOIN',
    };
    this.stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
  }
  onMessageReceived = (payload: Message) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'JOIN':
        break;
      case 'MESSAGE':
        this.newMessage.next(payloadData);
        break;
    }
  };
  onPrivateMessage = (payload: Message) => {
    var payloadData = JSON.parse(payload.body);
    this.newMessage.next(payloadData);
  };

  sendMessage(receiverCode: string, message: string, toGroup: boolean) {
    if (this.stompClient) {
      var chatMessage: IChatMessage = {
        id: null,
        identityCode: this.userData.identityCode,
        senderName: this.userData.username,
        receiverCode: receiverCode,
        content: this.messageService.transformMessage(message),
        status: 'MESSAGE',
        postedTime: new Date().toISOString(),
        toRoom: toGroup,
      };
      if (receiverCode == 'public') {
        this.stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      } else {
        if (toGroup) {
          this.sendToGroup(chatMessage);
        } else {
          this.sendToUser(chatMessage);
        }
      }
    }
  }

  sendToUser(chatMessage: IChatMessage) {
    this.userService
      .addPrivateConversation(
        chatMessage.identityCode,
        chatMessage.receiverCode
      )
      .subscribe({
        next: (res) => {
          this.stompClient.send(
            '/app/message-private',
            {},
            JSON.stringify(chatMessage)
          );
          this.newMessage.next(chatMessage);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  sendToGroup(chatMessage: IChatMessage) {}
}
