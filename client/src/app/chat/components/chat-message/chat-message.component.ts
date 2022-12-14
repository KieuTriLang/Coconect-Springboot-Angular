import { ConversationService } from './../../services/conversation.service';
import { IUserMess } from '../../interfaces/user-mess';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import * as copy from 'copy-to-clipboard';
@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent implements OnInit, AfterViewChecked {
  @Input() userCode!: string;
  @Input() userMess!: IUserMess;

  mColors: any;
  mMedias: any;
  constructor(
    private elementRef: ElementRef,
    private conversationService: ConversationService
  ) {}
  ngAfterViewChecked(): void {
    this.mColors =
      this.elementRef.nativeElement.querySelectorAll('.message-color');
    this.mColors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.copyColor);
    });
    this.mMedias = this.elementRef.nativeElement.querySelectorAll(
      '.m-image , .m-video'
    );
    this.mMedias.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.zoom);
    });
  }
  copyColor = (event: Event) => {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    copy(anchor.style.backgroundColor);
  };
  zoom = (event: Event) => {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    if (['IMG'].indexOf(anchor.tagName) >= 0) {
      anchor.parentElement?.classList.add('active');
    } else {
      if (
        (anchor.classList.contains('m-image') ||
          anchor.classList.contains('m-video')) &&
        anchor.classList.contains('active')
      ) {
        anchor.classList.remove('active');
      } else {
        anchor.classList.add('active');
      }
    }
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
