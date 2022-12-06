import { ITab } from './../interfaces/tab';
import { ChatService } from './chat.service';
import { ChatMessage } from './../models/chat-message';
import { Injectable } from '@angular/core';
import { UserMess } from '../models/user-mess';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  conversations = new Map<string, UserMess[]>();
  constructor(private chatService: ChatService) {
    this.conversations.set('public', []);
  }

  getByKey(key: string): UserMess[] {
    return this.conversations.get(key) || [];
  }

  setToKey(key: string, conversation: UserMess[]) {
    this.conversations.set(key, conversation);
  }

  add(chatMessage: ChatMessage) {
    if (chatMessage.receiverCode == 'public') {
      var publicConversation: UserMess[] =
        this.conversations.get('public') || [];
      this.setToKey(
        'public',
        this.addPublicMess(publicConversation, chatMessage)
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
        this.chatService.createNewTab(tab);
      }
      var privateConversation: UserMess[] =
        this.conversations.get(conversationCode) || [];
      this.setToKey(
        conversationCode,
        this.addPrivateMess(privateConversation, chatMessage)
      );
    }
  }

  addPublicMess(
    conversation: UserMess[],
    chatMessage: ChatMessage
  ): UserMess[] {
    const lengthConversation = conversation.length;
    if (lengthConversation > 0) {
      return this.oldConversation(
        conversation,
        lengthConversation,
        chatMessage
      );
    } else {
      return this.newConversation(conversation, chatMessage);
    }
  }

  addPrivateMess(
    conversation: UserMess[],
    chatMessage: ChatMessage
  ): UserMess[] {
    const lengthConversation = conversation.length;
    if (lengthConversation > 0) {
      return this.oldConversation(
        conversation,
        lengthConversation,
        chatMessage
      );
    } else {
      return this.newConversation(conversation, chatMessage);
    }
  }

  oldConversation(
    conversation: UserMess[],
    lengthConversation: number,
    chatMessage: ChatMessage
  ): UserMess[] {
    if (
      conversation[lengthConversation - 1].identityCode ==
      chatMessage.identityCode
    ) {
      conversation[lengthConversation - 1].messages = [
        ...conversation[lengthConversation - 1].messages,
        chatMessage.content,
      ];
    } else {
      var userMess: UserMess = {
        identityCode: chatMessage.identityCode,
        username: chatMessage.senderName,
        messages: [chatMessage.content],
        postedTime: chatMessage.postedTime,
      };
      conversation = [...conversation, userMess];
    }
    return conversation;
  }

  newConversation(
    conversation: UserMess[],
    chatMessage: ChatMessage
  ): UserMess[] {
    var userMess: UserMess = {
      identityCode: chatMessage.identityCode,
      username: chatMessage.senderName,
      messages: [chatMessage.content],
      postedTime: chatMessage.postedTime,
    };
    return [...conversation, userMess];
  }
}
