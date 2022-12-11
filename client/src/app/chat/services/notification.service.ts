import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { NotiType } from '../data/noti-type.data';
import { INotiItem } from '../interfaces/noti-item';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notiList: INotiItem[] = [];
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.authService.authenticated$.subscribe((val) => {
      if (val) {
        this.userService.getNotificatons().subscribe({
          next: (res) => {
            res.forEach((noti) => {
              this.notiList = [
                {
                  type: NotiType['invite'],
                  content: noti.content,
                  roomCode: noti.roomCode,
                  status: noti.status,
                  time: noti.time,
                },
                ...this.notiList,
              ];
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }
  createNewNoti(noti: INotiItem) {
    this.notiList = [noti, ...this.notiList];
  }
}
