import { ConversationService } from './../../services/conversation.service';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { IChatMessage } from '../../interfaces/chat-message';
import { ChatService } from './../../services/chat.service';
import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messC!: ElementRef;
  userCode: string = '';
  scrolling: boolean = false;
  constructor(
    public chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    public conversationService: ConversationService
  ) {
    this.chatService.newMessage$.subscribe((message) =>
      this.handleNewMessage(message)
    );
  }
  ngOnDestroy(): void {}

  ngAfterViewChecked(): void {
    if (!this.scrolling) {
      this.scrollToBottom();
    }
  }

  ngOnInit(): void {
    this.authService.authenticated$.subscribe((val) => {
      if (val) {
        this.init();
      }
    });
  }
  init() {
    this.userService.getInfo().subscribe({
      next: (res) => {
        this.chatService.registerUser({
          identityCode: res.userCode,
          username: res.username,
          connected: true,
        });
        this.userCode = res.userCode;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleNewMessage = (message: IChatMessage) => {
    this.conversationService.add(message, false);
    this.scrollToBottom();
  };

  handleTabChanged(conversationCode: string) {
    this.scrolling = false;
    this.conversationService.changeTab(conversationCode);
  }

  scrollToBottom() {
    try {
      this.messC.nativeElement.scrollTop =
        this.messC.nativeElement.scrollHeight;
    } catch (err) {}
  }
  handleScroll(e: any) {
    this.scrolling = true;
    const scrollHeight = e.target.scrollHeight;
    const scrollTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;

    if (this.conversationService.loading == false) {
      if (scrollTop == 0) {
        this.conversationService.loadMessageByConversationCode(
          this.conversationService.currentTab
        );
      }
    }
  }
}
