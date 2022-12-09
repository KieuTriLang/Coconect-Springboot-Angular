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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  isLogin = true;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  notiLog: INotiItem | null = {
    type: NotiType['info'],
    content: '',
    read: true,
    time: '',
  };
  @ViewChild('notiList') notiList!: ElementRef;
  constructor(
    private titleService: Title,
    public authService: AuthService,
    private storageService: StorageService,
    private fb: FormBuilder
  ) {
    this.titleService.setTitle('Coconect chat');
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {}
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  login() {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: (res) => {
            this.storageService.saveTokenToLocal(
              'cc_access_token',
              res.access_token
            );
            this.authService.authenticated.next(true);
            this.loginForm.reset();
          },
          error: (err) => {
            this.notiLog = {
              type: NotiType['danger'],
              content: 'Login failed! Your account maybe not exist!',
              read: true,
              time: '',
            };
          },
        });
    } else {
      this.notiLog = {
        type: NotiType['danger'],
        content: 'Login failed! Please check your info again!',
        read: true,
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
              read: true,
              time: '',
            };
          },
          error: (err) => {
            this.notiLog = {
              type: NotiType['danger'],
              content:
                'Register failed! Try changing your usename and re-registering!',
              read: true,
              time: '',
            };
          },
        });
    } else {
      this.notiLog = {
        type: NotiType['danger'],
        content: 'Regiter failed! Please check your info again!',
        read: true,
        time: '',
      };
    }
  }
  matchPassword(): boolean {
    return (
      this.registerForm.value.password == this.registerForm.value.rePassword
    );
  }
  scrollToBottom() {
    try {
      this.notiList.nativeElement.scrollTop =
        this.notiList.nativeElement.scrollHeight;
    } catch (err) {}
  }
  resetNotiLog() {
    this.notiLog = null;
  }
}
