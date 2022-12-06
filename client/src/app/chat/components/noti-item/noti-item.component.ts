import { NotiType } from './../../data/noti-type.data';
import { INotiItem } from './../../interfaces/noti-item';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-noti-item',
  templateUrl: './noti-item.component.html',
  styleUrls: ['./noti-item.component.scss'],
})
export class NotiItemComponent implements OnInit {
  @Input() noti: INotiItem = {
    type: NotiType['invite'],
    content: '',
    read: true,
    time: '',
  };
  constructor() {}

  ngOnInit(): void {}
}
