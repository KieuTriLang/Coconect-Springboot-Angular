import { UserMess } from './../../models/user-mess';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import * as copy from 'copy-to-clipboard';
@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent implements OnInit, AfterViewInit {
  @Input() userCode!: string;
  @Input() userMess!: UserMess;
  @Output() openChatByUser: EventEmitter<{
    identityCode: string;
    username: string;
  }> = new EventEmitter<{ identityCode: string; username: string }>();
  mColors: any;
  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit(): void {
    this.mColors =
      this.elementRef.nativeElement.querySelectorAll('.message-color');
    this.mColors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.handleAnchorClick);
    });
  }
  handleAnchorClick = (event: Event) => {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    copy(anchor.style.backgroundColor);
    console.log(anchor.style.background);
  };

  ngOnInit(): void {}

  openNewChat() {
    this.openChatByUser.emit({
      identityCode: this.userMess.identityCode,
      username: this.userMess.username,
    });
  }
}
