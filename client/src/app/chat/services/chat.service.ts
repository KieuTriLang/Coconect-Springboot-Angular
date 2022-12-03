import { StorageService } from './storage.service';
import { MessageService } from './message.service';
import { UserData } from './../models/user-data';
import { ChatMessage } from './../models/chat-message';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Client, Message, over } from 'stompjs';
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

  newMessage = new Subject<ChatMessage>();
  newMessage$ = this.newMessage.asObservable();
  constructor(
    private messageService: MessageService,
    private storageService: StorageService
  ) {}

  handleUserName(value: string) {
    this.userData = { ...this.userData, username: value };
  }
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
    this.userData = { ...this.userData, connected: true };
    this.stompClient.subscribe('/chatroom/public', this.onMessageReceived);
    this.stompClient.subscribe(
      '/user/' + this.userData.identityCode + '/private',
      this.onPrivateMessage
    );
  };
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
      var chatMessage: ChatMessage = {
        id: null,
        identityCode: this.userData.identityCode,
        senderName: this.userData.username,
        receiverCode: receiverCode,
        content: this.messageService.transformMessage(message),
        status: 'MESSAGE',
        postedTime: new Date().toISOString(),
        toGroup: toGroup,
      };
      if (receiverCode == 'public') {
        this.stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      } else {
        this.stompClient.send(
          '/app/message-private',
          {},
          JSON.stringify(chatMessage)
        );
        this.newMessage.next(chatMessage);
      }
    }
  }
}
