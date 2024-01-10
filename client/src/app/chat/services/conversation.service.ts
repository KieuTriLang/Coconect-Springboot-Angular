import { NotificationService } from './notification.service';
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
  typing = false;
  loading: boolean = false;
  tabPersonal: boolean = false;
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
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.notificationService.notiKick$.subscribe((roomCode) => {
      if (roomCode != null) {
        this.removeConversation(roomCode);
        this.chatService.unsubscribeRoom(roomCode);
      }
    });
    this.chatService.typing$.subscribe((val) => {
      if (
        val.identityCode != this.chatService.userData.identityCode &&
        val.receiverCode == this.currentTab
      ) {
        this.typing = true;
      }
    });
    this.chatService.connected$.subscribe((state) => {
      if (state) {
        this.userService.getInfo().subscribe({
          next: (res) => {
            this.tabs = [this.tabs[0]];

            this.conversations.set('public', []);
            if (res.conversations.length > 0) {
              res.conversations.forEach((tab) => {
                this.tabs = [
                  ...this.tabs,
                  { info: tab, raw: false, loadFirst: false },
                ];
                if (!tab.personal) {
                  this.chatService.addSubscription(tab.conversationCode,this.chatService.createSubscriptionRoom(tab.conversationCode));
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

  reset() {
    this.tabPersonal = false;
    this.currentTab = 'public';
    this.tabs = [
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
    this.chatService.unsubscribeAll();
    this.conversations = new Map<string, IUserMess[]>();
  }

  createNewTab(newTab: ITab, raw: boolean, loadFirst: boolean,byClient:boolean) {
    let existedConversation = this.tabs.filter(
      (tab: IConversation) =>
        tab.info.conversationCode == newTab.conversationCode
    );
    if (
      existedConversation.length == 0 &&
      newTab.conversationCode != this.chatService.userData.identityCode
    ) {
      this.tabs = [
        this.tabs[0],
        { info: newTab, raw: raw, loadFirst: loadFirst },
        ...this.tabs.slice(1),
      ];
      if (raw) {
        this.currentTab = newTab.conversationCode;
      }
      this.tabPersonal = newTab.personal;
      if (newTab.personal == false) {
        this.chatService.addSubscription(newTab.conversationCode,
          this.chatService.createSubscriptionRoom(newTab.conversationCode));
      }
    } else if(this.tabs.filter(t => t.info.conversationCode == newTab.conversationCode && t.raw == true).length > 0){
      this.tabs = this.tabs.map(t =>{
        if(t.info.conversationCode == newTab.conversationCode){
          t.raw = false;
          t.loadFirst = true;
        }
        return t;
      })
    }else{
      if(byClient)
      this.changeTab(newTab.conversationCode);
    }
  }
  changeTab(conversationCode: string) {
    if (this.currentTab != conversationCode) {
      this.tabs = this.tabs.filter((tab) => 
        tab.raw == false
      );
      this.tabs = this.tabs.map((tab) => {
        if(tab.info.conversationCode == conversationCode){
          tab.info.unread = 0;
          return tab;
        }else{
          return tab;
        }
      });
    }
    this.loadMessageByConversationCode(conversationCode);
  }
  loadMessageByConversationCode(conversationCode: string) {
    
    const conversation: IConversation = this.tabs.filter(
      (tab) => tab.info.conversationCode == conversationCode
    )[0];

    this.currentTab = conversation.info.conversationCode;
    this.tabPersonal = conversation.info.personal;
    this.loading = conversationCode != 'public';
    const beforeId: number =
      this.getByKey(conversationCode)[0]?.messages[0]?.id || 0;
      
    if (!conversation.loadFirst) {
      this.loadMessages(
        conversation.info.conversationCode,
        beforeId,
        conversation.info.personal
      );
    } else if (conversation.info.conversationCode != 'public') {
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
          this.loading = false;
          this.checkToScrollToBottom();
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
          this.loading = false;
          this.checkToScrollToBottom();
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
  }

  checkToScrollToBottom() {
    if (!this.chatService.scrolling) {
      this.chatService.scrollToBottom.next(true);
    }
  }
  removeConversation(roomCode: string) {
    if (this.currentTab == roomCode) {
      this.changeTab('public');
    }
    this.tabs = this.tabs.filter((t) => t.info.conversationCode != roomCode);
    this.conversations.delete(roomCode);
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
    } else if (chatMessage.toRoom) {
      var roomConversation: IUserMess[] =
        this.conversations.get(chatMessage.receiverCode) || [];
      this.setToKey(
        chatMessage.receiverCode,
        this.addPublicMess(roomConversation, chatMessage, fromServer)
      );
    } else {
      var conversationCode = '';
      if (chatMessage.identityCode == this.chatService.userData.identityCode) {
        conversationCode = chatMessage.receiverCode;
        if (!fromServer) {
          let tab: ITab = {
            id: null,
            conversationCode: chatMessage.receiverCode,
            name: "",
            personal: true,
            unread: 0,
          };
          this.createNewTab(tab, false, true,false);
        }
      } else {
        conversationCode = chatMessage.identityCode;
        if (!fromServer) {
          let tab: ITab = {
            id: null,
            conversationCode: chatMessage.identityCode,
            name: chatMessage.senderName,
            personal: true,
            unread: 0,
          };
          this.createNewTab(tab, false, true,false);
        }        
      }
      var converdsation: IUserMess[] =
        this.conversations.get(conversationCode) || [];
      this.setToKey(
        conversationCode,
        this.addPrivateMess(converdsation, chatMessage, fromServer)
      );
    }
    this.tabs = this.tabs.map(t =>{
      if(chatMessage.receiverCode == this.chatService.userData.identityCode
        &&  t.info.conversationCode == chatMessage.identityCode
        && this.currentTab != chatMessage.identityCode){
          t.info.unread +=1;
      }
      if(t.info.conversationCode == chatMessage.receiverCode
        && chatMessage.identityCode != this.chatService.userData.identityCode
        && this.currentTab != chatMessage.receiverCode){
        t.info.unread +=1;
      }
      return t;
    })
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
      toRoom: chatMessage.toRoom,
    };
    return fromServer
      ? [userMess, ...conversation]
      : [...conversation, userMess];
  }
}
