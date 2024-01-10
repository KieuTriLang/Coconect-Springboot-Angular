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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageContainer') messC!: ElementRef;
  userCode: string = '';
  scrolling: boolean = false;
  isOpenedMemberList: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(
    public chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    public conversationService: ConversationService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  ngAfterViewChecked(): void {}

  ngOnInit(): void {
    this.addNewSubscription(
      this.chatService.newMessage$.subscribe((message) => {
        this.handleNewMessage(message);
      })
    );
    this.addNewSubscription(
      this.authService.authenticated$.subscribe({
        next: (val) => {
          if (val) {
            this.init();
          } else {
            this.reset();
          }
        },
      })
    );
    this.addNewSubscription(
      this.chatService.scrollToBottom$.subscribe((val) => {
        if (val) {
          this.scrollToBottom();
        }
      })
    );
  }

  addNewSubscription(subscription: Subscription) {
    this.subscriptions = [...this.subscriptions, subscription];
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
  reset() {
    this.userCode = '';
    this.scrolling = false;
    this.isOpenedMemberList = false;
    this.conversationService.reset();
    this.chatService.reset();
  }
  handleNewMessage = (message: IChatMessage) => {
    this.conversationService.add(message, false);
    this.scrollToBottom();
  };

  handleTabChanged(conversationCode: string) {
    this.scrolling = false;
    if (conversationCode == 'public') {
      this.isOpenedMemberList = false;
    }
    this.conversationService.changeTab(conversationCode);
  }

  handleCloseMemberList(value: boolean) {
    if (!value) return;
    this.isOpenedMemberList = false;
  }

  scrollToBottom() {
    try {
      this.messC.nativeElement.scrollTop =
        this.messC.nativeElement.scrollHeight;
    } catch (error) {}
  }
  handleScroll = (e: any) => {
    this.chatService.scrolling = true;
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
  };
  handleNotiFromMemberList(hasData: boolean) {
    if (hasData) {
      this.isOpenedMemberList = true;
    }
  }
}
