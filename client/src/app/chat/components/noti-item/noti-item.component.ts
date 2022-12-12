import { UserService } from './../../services/user.service';
import { ConversationService } from './../../services/conversation.service';
import { NotificationService } from './../../services/notification.service';
import { NotiType } from './../../data/noti-type.data';
import { INotiItem } from './../../interfaces/noti-item';
import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-noti-item',
  templateUrl: './noti-item.component.html',
  styleUrls: ['./noti-item.component.scss'],
})
export class NotiItemComponent implements OnInit {
  @Input() noti: INotiItem = {
    type: NotiType['invite'],
    content: '',
    roomCode: '',
    roomName: '',
    status: '',
    time: '',
  };
  @Input() index!: number;

  acceptIcon = faCheck;
  denyIcon = faTimes;
  constructor(
    private notificationService: NotificationService,
    private conversationService: ConversationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  accept(roomCode: string) {
    this.userService.acceptInvite(roomCode).subscribe({
      next: (res) => {
        this.conversationService.createNewTab(
          {
            id: null,
            conversationCode: roomCode,
            name: this.noti.roomName,
            unread: 0,
            personal: false,
          },
          false,
          false
        );
        let notiList = this.notificationService.notiList;
        this.notificationService.notiList = notiList.map((nt, index) =>
          index == this.index ? { ...nt, status: 'ACCEPT' } : nt
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deny(roomCode: string) {
    this.userService.denyInvite(roomCode).subscribe({
      next: (res) => {
        let notiList = this.notificationService.notiList;
        this.notificationService.notiList = notiList.map((nt, index) =>
          index == this.index ? { ...nt, status: 'DENY' } : nt
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
