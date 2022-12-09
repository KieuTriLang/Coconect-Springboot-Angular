import { IConversation } from './../interfaces/conversation';
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
  tabs: IConversation[] = [
    {
      info: {
        id: null,
        conversationCode: 'public',
        name: 'Public room',
        unread: 0,
        personal: false,
      },
      raw: false,
      loadFirst: true,
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
                this.tabs = [
                  ...this.tabs,
                  { info: tab, raw: false, loadFirst: false },
                ];
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

  createNewTab(newTab: ITab, raw: boolean, loadFirst: boolean) {
    if (
      this.tabs.filter(
        (tab: IConversation) =>
          tab.info.conversationCode == newTab.conversationCode
      ).length == 0 &&
      newTab.conversationCode != this.chatService.userData.identityCode
    ) {
      this.tabs = [
        ...this.tabs,
        { info: newTab, raw: raw, loadFirst: loadFirst },
      ];
      this.currentTab = newTab.conversationCode;
    }
  }
  changeTab(conversationCode: string) {
    if (this.currentTab != conversationCode) {
      this.tabs = this.tabs.filter((tab) => tab.raw == false);
    }
    this.currentTab = conversationCode;

    const conversation: IConversation = this.tabs.filter(
      (tab) => tab.info.conversationCode == conversationCode
    )[0];
    if (!conversation.loadFirst) {
      const beforeId: number =
        this.getByKey(conversationCode)[0]?.messages[0]?.id || 0;
      this.loadMessages(
        conversation.info.conversationCode,
        beforeId,
        conversation.info.personal
      );
    }
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
    this.tabs = this.tabs.map((conversation) =>
      conversation.info.conversationCode == conversationCode
        ? { ...conversation, loadFirst: true }
        : conversation
    );
    console.log(this.tabs);
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
        this.createNewTab(tab, false, true);
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
      return this.newMessToConversation(conversation, chatMessage, fromServer);
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
      return this.newMessToConversation(conversation, chatMessage, fromServer);
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
        chatMessage.identityCode &&
      !fromServer
    ) {
      conversation[lengthConversation - 1].messages = [
        ...conversation[lengthConversation - 1].messages,
        { id: chatMessage.id, content: chatMessage.content },
      ];
    } else if (
      conversation[0].identityCode == chatMessage.identityCode &&
      fromServer
    ) {
      conversation[0].messages = [
        { id: chatMessage.id, content: chatMessage.content },
        ...conversation[0].messages,
      ];
    } else {
      conversation = this.newMessToConversation(
        conversation,
        chatMessage,
        fromServer
      );
    }
    return conversation;
  }

  newMessToConversation(
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
