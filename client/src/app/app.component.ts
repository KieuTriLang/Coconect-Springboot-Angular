import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ChatService } from './chat/services/chat.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  username = new FormControl();
  form!: FormGroup;
  constructor(
    private titleService: Title,
    public chatService: ChatService,
    private fb: FormBuilder
  ) {
    this.titleService.setTitle('Coconect chat');
    this.form = this.fb.group({
      username: ['', [Validators.required]],
    });
  }
  submit() {
    if (this.form.valid) {
      this.chatService.registerUser(this.form.value.username);
    }
  }
}
