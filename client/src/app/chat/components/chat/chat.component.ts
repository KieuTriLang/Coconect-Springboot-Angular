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
    this.chatService.newMessage$.subscribe((message) => this.handleNewMessage);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.userCode = this.chatService.userData.identityCode;
    this.conversations.set('public', [
      // {
      //   identityCode: 'lowefk',
      //   username: 'David',
      //   messages: [
      //     'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
      //     'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
      //   ],
      //   postedTime: '1:30PM',
      // },
      // {
      //   identityCode: 'me',
      //   username: 'Lang',
      //   messages: [
      //     'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
      //     'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
      //   ],
      //   postedTime: '1:30PM',
      // },
      // {
      //   identityCode: 'kiet',
      //   username: 'Kiet',
      //   messages: [
      //     'Lorem ipsum dolor ore?',
      //     'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
      //   ],
      //   postedTime: '1:30PM',
      // },
      // {
      //   identityCode: 'duy',
      //   username: 'dong phuong bat bai',
      //   messages: ['Lorem ipsum dolor ore?'],
      //   postedTime: '1:30PM',
      // },
    ]);
  }
  handleNewMessage = (message: ChatMessage) => {
    if (message.receiverCode == 'public') {
      var publicConversation: UserMess[] =
        this.conversations.get('public') || [];
      if (publicConversation.length > 0) {
        var length = publicConversation.length;
        if (
          publicConversation[length - 1].identityCode == message.identityCode
        ) {
          publicConversation[length - 1].messages = [
            ...publicConversation[length - 1].messages,
            message.content,
          ];
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
    } else {
      var privateConversation: UserMess[] =
        this.conversations.get(message.receiverCode) || [];
      if (privateConversation) {
        var length = privateConversation.length;
        if (
          privateConversation[length - 1].identityCode == message.identityCode
        ) {
          privateConversation[length - 1].messages = [
            ...privateConversation[length - 1].messages,
            message.content,
          ];
        }
      } else {
        var userMess: UserMess = {
          identityCode: message.identityCode,
          username: message.senderName,
          messages: [message.content],
          postedTime: message.postedTime,
        };
        privateConversation = [userMess];
        this.tabs = [
          ...this.tabs,
          { identityCode: message.identityCode, name: message.senderName },
        ];
        this.conversations.set(message.receiverCode, privateConversation);
      }
    }
  };
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
