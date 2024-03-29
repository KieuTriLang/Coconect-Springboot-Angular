import { BehaviorSubject } from 'rxjs';
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

  newNoti = new BehaviorSubject<boolean>(false);
  newNoti$ = this.newNoti.asObservable();

  notiKick = new BehaviorSubject<string | null>(null);
  notiKick$ = this.notiKick.asObservable();

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService.authenticated$.subscribe({
      next: (authenticated) => {
        if (authenticated) {
          this.userService.getNotificatons().subscribe({
            next: (res) => {
              res.forEach((noti) => {
                this.notiList = [
                  {
                    id: noti.id,
                    type: NotiType['invite'],
                    content: noti.content,
                    roomCode: noti.roomCode,
                    roomName: noti.roomName,
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
      },
    });
  }
  createNewNoti(noti: INotiItem) {
    this.notiList = [noti, ...this.notiList];
    this.newNoti.next(true);
    if (noti.status == 'KICK') {
      this.notiKick.next(noti.roomCode);
    }
  }
  reset(){
    this.notiList = [];
  }
}
