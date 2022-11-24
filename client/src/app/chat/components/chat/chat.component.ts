import { ChatMessage } from './../../models/chat-message';
import { ChatService } from './../../services/chat.service';
import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UserMess } from '../../models/user-mess';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') messC!: ElementRef;
  userCode = 'me';
  tabSelected: string = 'public';
  tabs: { identityCode: string; name: string }[] = [
    { name: 'Public room', identityCode: 'public' },
  ];
  conversations = new Map<string, UserMess[]>();
  constructor(private chatService: ChatService) {
    this.chatService.newMessage$.subscribe((message) =>
      this.handleNewMessage(message)
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.userCode = this.chatService.userData.identityCode;
    this.conversations.set('public', []);
  }
  handleNewMessage = (message: ChatMessage) => {
    if (message.receiverCode == 'public') {
      this.handlePublicMess(message);
    } else {
      this.handlePrivateMess(message);
    }
  };

  handlePublicMess(message: ChatMessage) {
    var publicConversation: UserMess[] = this.conversations.get('public') || [];
    var lengthCon = publicConversation.length;
    if (lengthCon > 0) {
      if (
        publicConversation[lengthCon - 1].identityCode == message.identityCode
      ) {
        publicConversation[lengthCon - 1].messages = [
          ...publicConversation[lengthCon - 1].messages,
          message.content,
        ];
      } else {
        var userMess: UserMess = {
          identityCode: message.identityCode,
          username: message.senderName,
          messages: [message.content],
          postedTime: message.postedTime,
        };
        publicConversation = [...publicConversation, userMess];
      }
    } else {
      var userMess: UserMess = {
        identityCode: message.identityCode,
        username: message.senderName,
        messages: [message.content],
        postedTime: message.postedTime,
      };
      publicConversation = [...publicConversation, userMess];
    }
    this.conversations.set('public', publicConversation);
  }
  handlePrivateMess(message: ChatMessage) {
    var conversationCode =
      message.identityCode == this.chatService.userData.identityCode
        ? message.receiverCode
        : message.identityCode;
    var privateConversation: UserMess[] =
      this.conversations.get(conversationCode) || [];
    var lengthCon = privateConversation.length;
    if (lengthCon > 0) {
      if (
        privateConversation[lengthCon - 1].identityCode == message.identityCode
      ) {
        privateConversation[lengthCon - 1].messages = [
          ...privateConversation[lengthCon - 1].messages,
          message.content,
        ];
      } else {
        var userMess: UserMess = {
          identityCode: message.identityCode,
          username: message.senderName,
          messages: [message.content],
          postedTime: message.postedTime,
        };
        privateConversation = [...privateConversation, userMess];
      }
    } else {
      var userMess: UserMess = {
        identityCode: message.identityCode,
        username: message.senderName,
        messages: [message.content],
        postedTime: message.postedTime,
      };
      privateConversation = [userMess];
      if (
        this.tabs.filter((value) => value.identityCode == message.identityCode)
          .length == 0 &&
        message.identityCode != this.chatService.userData.identityCode
      ) {
        this.tabs = [
          ...this.tabs,
          { identityCode: message.identityCode, name: message.senderName },
        ];
      }
    }
    this.conversations.set(conversationCode, privateConversation);
    console.log(this.conversations);
  }
  scrollToBottom() {
    try {
      this.messC.nativeElement.scrollTop =
        this.messC.nativeElement.scrollHeight;
    } catch (err) {}
  }
  handleTabSelected(value: string) {
    this.tabSelected = value;
  }
  handleNewConversation(value: { username: string; identityCode: string }) {
    if (
      this.tabs.filter((tab) => tab.identityCode == value.identityCode).length >
      0
    ) {
      this.tabSelected = value.identityCode;
    } else {
      this.tabSelected = value.identityCode;
      this.tabs = [
        ...this.tabs,
        { name: value.username, identityCode: value.identityCode },
      ];
      this.conversations.set(value.identityCode, []);
    }
  }
}