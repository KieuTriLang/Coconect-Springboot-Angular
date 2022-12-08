import { UserService } from './user.service';
import { ITab } from './../interfaces/tab';
import { ChatService } from './chat.service';
import { IChatMessage } from '../interfaces/chat-message';
import { Injectable } from '@angular/core';
import { IUserMess } from '../interfaces/user-mess';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
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

  conversations: Map<string, IUserMess[]> = new Map<string, IUserMess[]>();
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {
    this.chatService.connected$.subscribe((state) => {
      if (state) {
        this.userService.getInfo().subscribe({
          next: (res) => {
            this.conversations.set('public', []);
            if (res.conversations.length > 0) {
              res.conversations.forEach((tab) => {
                this.tabs = [...this.tabs, tab];
                if (!tab.personal) {
                  this.chatService.subscribeRoom(tab.conversationCode);
                  this.conversations.set(tab.conversationCode, []);
                }
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  createNewTab(newTab: ITab) {
    if (
      this.tabs.filter(
        (tab: ITab) => tab.conversationCode == newTab.conversationCode
      ).length == 0 &&
      newTab.conversationCode != this.chatService.userData.identityCode
    ) {
      this.tabs = [...this.tabs, newTab];
      this.currentTab = newTab.conversationCode;
    }
  }
  changeTab(conversationCode: string) {
    this.currentTab = conversationCode;
    const beforeId: number =
      this.getByKey(conversationCode)[0]?.messages[0]?.id || 0;
    const tabSelected: ITab = this.tabs.filter(
      (tab) => tab.conversationCode == conversationCode
    )[0];
    this.loadMessages(
      tabSelected.conversationCode,
      beforeId,
      tabSelected.personal
    );
  }

  loadMessages(conversationCode: string, beforeId: number, personal: boolean) {
    if (personal) {
      this.userService.getMessagePrivate(conversationCode, beforeId).subscribe({
        next: (res) => {
          res.forEach((message) => {
            this.add(message, true);
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.userService.getMessageRoom(conversationCode, beforeId).subscribe({
        next: (res) => {
          res.forEach((message) => {
            this.add(message, true);
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getByKey(key: string): IUserMess[] {
    return this.conversations.get(key) || [];
  }

  setToKey(key: string, conversation: IUserMess[]) {
    this.conversations.set(key, conversation);
  }

  add(chatMessage: IChatMessage, fromServer: boolean) {
    if (chatMessage.receiverCode == 'public') {
      var publicConversation: IUserMess[] =
        this.conversations.get('public') || [];
      this.setToKey(
        'public',
        this.addPublicMess(publicConversation, chatMessage, fromServer)
      );
    } else {
      var conversationCode = '';
      if (chatMessage.identityCode == this.chatService.userData.identityCode) {
        conversationCode = chatMessage.receiverCode;
      } else {
        conversationCode = chatMessage.identityCode;
        let tab: ITab = {
          id: null,
          conversationCode: chatMessage.identityCode,
          name: chatMessage.senderName,
          personal: true,
          unread: 0,
        };
        this.createNewTab(tab);
      }
      var converdsation: IUserMess[] =
        this.conversations.get(conversationCode) || [];
      this.setToKey(
        conversationCode,
        this.addPrivateMess(converdsation, chatMessage, fromServer)
      );
    }
  }

  addPublicMess(
    conversation: IUserMess[],
    chatMessage: IChatMessage,
    fromServer: boolean
  ): IUserMess[] {
    const lengthConversation = conversation.length;
    if (lengthConversation > 0) {
      return this.oldConversation(
        conversation,
        lengthConversation,
        chatMessage,
        fromServer
      );
    } else {
      return this.newConversation(conversation, chatMessage, fromServer);
    }
  }

  addPrivateMess(
    conversation: IUserMess[],
    chatMessage: IChatMessage,
    fromServer: boolean
  ): IUserMess[] {
    const lengthConversation = conversation.length;
    if (lengthConversation > 0) {
      return this.oldConversation(
        conversation,
        lengthConversation,
        chatMessage,
        fromServer
      );
    } else {
      return this.newConversation(conversation, chatMessage, fromServer);
    }
  }

  oldConversation(
    conversation: IUserMess[],
    lengthConversation: number,
    chatMessage: IChatMessage,
    fromServer: boolean
  ): IUserMess[] {
    if (
      conversation[lengthConversation - 1].identityCode ==
      chatMessage.identityCode
    ) {
      conversation[lengthConversation - 1].messages = fromServer
        ? [
            { id: chatMessage.id, content: chatMessage.content },
            ...conversation[lengthConversation - 1].messages,
          ]
        : [
            ...conversation[lengthConversation - 1].messages,
            { id: chatMessage.id, content: chatMessage.content },
          ];
    } else {
      var userMess: IUserMess = {
        identityCode: chatMessage.identityCode,
        username: chatMessage.senderName,
        messages: [{ id: chatMessage.id, content: chatMessage.content }],
        postedTime: chatMessage.postedTime,
      };
      conversation = fromServer
        ? [userMess, ...conversation]
        : [...conversation, userMess];
    }
    return conversation;
  }

  newConversation(
    conversation: IUserMess[],
    chatMessage: IChatMessage,
    fromServer: boolean
  ): IUserMess[] {
    var userMess: IUserMess = {
      identityCode: chatMessage.identityCode,
      username: chatMessage.senderName,
      messages: [{ id: chatMessage.id, content: chatMessage.content }],
      postedTime: chatMessage.postedTime,
    };
    return fromServer
      ? [userMess, ...conversation]
      : [...conversation, userMess];
  }
}
