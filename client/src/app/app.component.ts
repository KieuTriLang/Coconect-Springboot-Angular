import { NotificationService } from './chat/services/notification.service';
import { UserService } from './chat/services/user.service';
import { NotiType } from './chat/data/noti-type.data';
import { INotiItem } from './chat/interfaces/noti-item';
import { StorageService } from './chat/services/storage.service';
import { AuthService } from './chat/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { CommandService, ICommandRegex } from './chat/services/command.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLogin = true;
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  commandList : ICommandRegex[] =[];
  notificationIcon = faBell;
  notificationOpen = false;
  notiLog: INotiItem | null = {
    type: NotiType['info'],
    content: '',
    roomCode: '',
    roomName: '',
    status: '',
    time: '',
  };
  constructor(
    private titleService: Title,
    public authService: AuthService,
    private storageService: StorageService,
    private commandService: CommandService,
    public notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.titleService.setTitle('Coconect chat');
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.registerForm = this.fb.group({
      username: ['', [Validators.required,Validators.pattern(/^[^\s]*$/)]],
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.commandList = Object.values(this.commandService.prefixCommandRegex);
    this.authService.authenticated$.subscribe({next: value =>{if(!value) this.notificationService.reset()}})
  }
  login() {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: (res) => {
            this.storageService.saveTokenToLocal(
              'cc_access_token',
              res.accessToken
            );
            this.authService.authenticated.next(true);
            this.loginForm.reset();
          },
          error: (err) => {
            this.notiLog = {
              type: NotiType['danger'],
              content: 'Login failed! Your account maybe not exist!',
              roomCode: '',
              roomName: '',
              status: '',
              time: '',
            };
          },
        });
    } else {
      this.notiLog = {
        type: NotiType['danger'],
        content: 'Login failed! Please check your info again!',
        roomCode: '',
        roomName: '',
        status: '',
        time: '',
      };
    }
  }
  register() {
    if (this.registerForm.valid && this.matchPassword()) {
      this.authService
        .register(
          this.registerForm.value.username,
          this.registerForm.value.password
        )
        .subscribe({
          next: (res) => {
            this.isLogin = true;
            this.registerForm.reset();
            this.notiLog = {
              type: NotiType['checked'],
              content: 'Register successfully!',
              roomCode: '',
              roomName: '',
              status: '',
              time: '',
            };
          },
          error: (err) => {
            this.notiLog = {
              type: NotiType['danger'],
              content:
                'Register failed! Try changing your usename and re-registering!',
              roomCode: '',
              roomName: '',
              status: '',
              time: '',
            };
          },
        });
    } else {
      this.notiLog = {
        type: NotiType['danger'],
        content: 'Regiter failed! Fill full infomation. Username must not contains spacing!',
        roomCode: '',
        roomName: '',
        status: '',
        time: '',
      };
    }
  }
  matchPassword(): boolean {
    return (
      this.registerForm.value.password == this.registerForm.value.rePassword
    );
  }
  resetNotiLog() {
    this.notiLog = null;
  }
  openNoti() {
    this.notificationOpen = !this.notificationOpen;
    this.notificationService.newNoti.next(false);
  }

  addCommandToMessageInput(value:string){
    this.commandService.sendCommandText.next(value);
  }
}
