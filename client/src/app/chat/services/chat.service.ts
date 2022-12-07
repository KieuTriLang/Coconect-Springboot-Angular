// import { ITab } from './../interfaces/tab';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { MessageService } from './message.service';
import { UserData } from '../interfaces/user-data';
import { ChatMessage } from './../models/chat-message';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Client, Message, over } from 'stompjs';
import { Subject } from 'rxjs';
import { ITab } from '../interfaces/tab';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = environment.baseUrl;

  currentTab: string = 'public';
  tabs: ITab[] = [
    {
      id: null,
      conversationCode: 'public',
      name: 'Public room',
      unread: 0,
      personal: false,
    },
  ];

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
    private storageService: StorageService,
    private authService: AuthService,
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
    this.authService.authenticated$.subscribe((val) => {
      if (!val) {
        return;
      }
      this.userService.getInfo().subscribe({
        next: (res) => {
          if (res.conversations.length > 0) {
            res.conversations.forEach((tab) => {
              if (!tab.personal) {
                this.subscribeRoom(tab.conversationCode);
              }
            });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  };

  subscribeRoom(roomCode: string) {
    this.stompClient.subscribe(`/room/${roomCode}`, this.onMessageReceived);
  }
  unsubscribeRoom(roomCode: string) {}

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
        toRoom: toGroup,
      };
      if (receiverCode == 'public') {
        this.stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      } else {
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
    }
  }

  createNewTab(newTab: ITab) {
    if (
      this.tabs.filter(
        (tab: ITab) => tab.conversationCode == newTab.conversationCode
      ).length == 0 &&
      newTab.conversationCode != this.userData.identityCode
    ) {
      this.tabs = [...this.tabs, newTab];
      this.currentTab = newTab.conversationCode;
    }
  }
  changeTab(conversationCode: string) {
    this.currentTab = conversationCode;
  }
}
