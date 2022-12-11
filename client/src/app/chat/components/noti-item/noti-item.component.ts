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
    status: '',
    time: '',
  };

  acceptIcon = faCheck;
  denyIcon = faTimes;
  constructor() {}

  ngOnInit(): void {}

  accept(roomCode: string) {}
  deny(roomCode: string) {}
}
