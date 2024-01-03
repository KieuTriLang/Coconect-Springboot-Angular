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
import { CommandService } from '../../services/command.service';
@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent implements OnInit, AfterViewChecked {
  @Input() userCode!: string;
  @Input() userMess!: IUserMess;
  @Input() tabSelected!: string;
  @Input() tabPersonal!: boolean;

  mColors: any;
  mMedias: any;
  constructor(
    private elementRef: ElementRef,
    private conversationService: ConversationService,
    private commandService: CommandService
  ) { }
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
    const rgbString = this.rgbStringToRgbValues(anchor.style.backgroundColor);
    if (rgbString) {
      const [red, green, blue] = rgbString;
      copy(this.rgbToHex(red,green,blue));
    }

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


  rgbStringToRgbValues(rgbString: string): number[] | null {
    const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (match) {
      // Extracted values are in match[1], match[2], and match[3]
      const red = parseInt(match[1], 10);
      const green = parseInt(match[2], 10);
      const blue = parseInt(match[3], 10);

      return [red, green, blue];
    }

    // Return null if the string doesn't match the expected format
    return null;
  }
  componentToHex(c: number): string {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(red: number, green: number, blue: number): string {
    return "#" + this.componentToHex(red) + this.componentToHex(green) + this.componentToHex(blue);
  }

  ngOnInit(): void { }

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
  addUserInfoToMessageInput(){
    this.commandService.sendUserInfo.next(this.userMess.username);
  }
}
