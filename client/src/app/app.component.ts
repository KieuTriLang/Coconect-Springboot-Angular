import { FormGroup, FormControl } from '@angular/forms';
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
  constructor(private titleService: Title, public chatService: ChatService) {
    this.titleService.setTitle('Coconect chat');
    this.username.valueChanges.subscribe((value) => {
      this.chatService.handleUserName(value);
    });
  }
}
