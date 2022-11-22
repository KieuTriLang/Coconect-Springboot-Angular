import { UserMess } from './../../models/user-mess';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() userCode!: string;
  @Input() userMess!: UserMess;
  @Output() openChatByUser: EventEmitter<{
    identityCode: string;
    username: string;
  }> = new EventEmitter<{ identityCode: string; username: string }>();
  constructor() {}

  ngOnInit(): void {}

  openNewChat() {
    this.openChatByUser.emit({
      identityCode: this.userMess.identityCode,
      username: this.userMess.username,
    });
  }
}
