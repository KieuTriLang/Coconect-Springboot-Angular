import { MessageService } from './message.service';
import { UserData } from './../models/user-data';
import { ChatMessage } from './../models/chat-message';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Client, Message, over } from 'stompjs';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = environment.baseUrl;

  userData: UserData = {
    identityCode: this.makeIdentityCode(15),
    username: '',
    connected: false,
  };
  stompClient!: Client;

  newMessage = new Subject<ChatMessage>();
  newMessage$ = this.newMessage.asObservable();
  constructor(private messageService: MessageService) {}

  handleUserName(value: string) {
    this.userData = { ...this.userData, username: value };
  }
  registerUser(username: string) {
    this.userData.username = username;
    this.connect();
  }
  connect = () => {
    let sock = new SockJS(`${this.baseUrl}/ws`, null, {});
    this.stompClient = over(sock);
    this.stompClient.connect(
      // { 'ngrok-skip-browser-warning': 1606 },
      {},
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

  sendMessage(receiverCode: string, message: string) {
    if (this.stompClient) {
      var chatMessage: ChatMessage = {
        identityCode: this.userData.identityCode,
        senderName: this.userData.username,
        receiverCode: receiverCode,
        content: this.messageService.transformMessage(message),
        status: 'MESSAGE',
        postedTime: new Date().toISOString(),
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

  makeIdentityCode(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
