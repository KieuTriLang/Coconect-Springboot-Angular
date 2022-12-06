import { CommandService } from './../../services/command.service';
import { ChatService } from './../../services/chat.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.scss'],
})
export class ChatbarComponent implements OnInit {
  @Input() tabSelected = 'public';
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private commandService: CommandService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.valid) {
      const text = this.form.value.message;
      if (this.commandService.checkAllPrefixCommand(text)) {
        this.handleCommand(text);
      } else {
        this.chatService.sendMessage(this.tabSelected, text, false);
      }
      this.form.reset();
    }
  }

  handleCommand(text: string) {
    const newText: string = this.commandService.removeAllPrefix(text);
    const nameList: string[] = this.getListStringFromText(newText);
    const { createRoom, addMember, removeMember, leaveRoom } =
      this.commandService.prefixCommandRegex;
    if (newText.length == 0) {
      return;
    }
    switch (true) {
      case new RegExp(createRoom.regex, 'i').test(text):
        createRoom.action({
          roomCode: '',
          roomName: nameList.join(' '),
          members: [],
        });
        break;
      case new RegExp(addMember.regex, 'i').test(text) &&
        this.tabSelected != 'public':
        addMember.action({
          roomCode: this.tabSelected,
          roomName: '',
          members: nameList,
        });
        break;
      case new RegExp(removeMember.regex, 'i').test(text) &&
        this.tabSelected != 'public':
        removeMember.action({
          roomCode: '1234',
          roomName: '',
          members: nameList,
        });
        break;
      case new RegExp(leaveRoom.regex, 'i').test(text) &&
        this.tabSelected != 'public':
        leaveRoom.action({
          roomCode: '1234',
          roomName: '',
          members: nameList,
        });
        break;
      default:
        break;
    }
  }

  getListStringFromText(text: string): string[] {
    return text.trim().split(' ');
  }
}
