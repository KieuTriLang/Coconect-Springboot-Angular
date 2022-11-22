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
  constructor() {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    console.log('oninit');
    this.conversations.set('public', [
      {
        identityCode: 'lowefk',
        username: 'David',
        messages: [
          'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
          'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
        ],
        postedTime: '1:30PM',
      },
      {
        identityCode: 'me',
        username: 'Lang',
        messages: [
          'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
          'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
        ],
        postedTime: '1:30PM',
      },
      {
        identityCode: 'kiet',
        username: 'Kiet',
        messages: [
          'Lorem ipsum dolor ore?',
          'Lorem ipsum dolor sit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio autem cum quisquam nesciunt minus, atque ducimus, ipsa veniam repellendus perferendis sunt illum. Consequatur ullam dolore recusandae explicabo consectetur vero inventore?',
        ],
        postedTime: '1:30PM',
      },
      {
        identityCode: 'duy',
        username: 'dong phuong bat bai',
        messages: ['Lorem ipsum dolor ore?'],
        postedTime: '1:30PM',
      },
    ]);
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
  handleNewChat(value: { username: string; identityCode: string }) {
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
