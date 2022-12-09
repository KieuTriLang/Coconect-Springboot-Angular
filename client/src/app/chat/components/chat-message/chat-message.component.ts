import { ConversationService } from './../../services/conversation.service';
import { IUserMess } from '../../interfaces/user-mess';
import {
  Component,
  Input,
  OnInit,
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
  @Input() userMess!: IUserMess;

  mColors: any;
  constructor(
    private elementRef: ElementRef,
    private conversationService: ConversationService
  ) {}
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
  };

  ngOnInit(): void {}

  openNewChat() {
    this.conversationService.createNewTab(
      {
        id: null,
        conversationCode: this.userMess.identityCode,
        name: this.userMess.username,
        unread: 0,
        personal: true,
      },
      true,
      true
    );
  }
}
