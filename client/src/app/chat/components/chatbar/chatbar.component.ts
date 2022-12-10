import { MessageService } from './../../services/message.service';
import { MediaFileService } from './../../services/mediaFile.service';
import { CommandService } from './../../services/command.service';
import { ChatService } from './../../services/chat.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  faCirclePlus,
  faFileImage,
  faFileVideo,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.scss'],
})
export class ChatbarComponent implements OnInit {
  @Input() tabSelected = 'public';
  @Input() tabPersonal = false;

  imageRegex: RegExp = new RegExp(/^image\//, 'i');
  videoRegex: RegExp = new RegExp(/^video\//, 'i');
  form!: FormGroup;

  addIcon = faCirclePlus;
  imageIcon = faFileImage;
  videoIcon = faFileVideo;

  attachmentOpen: boolean = false;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private commandService: CommandService,
    private mediaFileService: MediaFileService,
    private messageService: MessageService
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
        this.chatService.sendMessage(this.tabSelected, text, !this.tabPersonal);
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

  upload(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files?.length) {
      const file: File = target.files[0];
      const acceptProp = target.accept;
      if (this.imageRegex.test(acceptProp)) {
        if (this.imageRegex.test(file?.type || '')) {
          this.mediaFileService.uploadImage(file).subscribe({
            next: (res) => {
              this.chatService.sendMessage(
                this.tabSelected,
                this.messageService.transformFile(res, file?.type),
                !this.tabPersonal
              );
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      }
      if (this.videoRegex.test(acceptProp)) {
        if (this.videoRegex.test(file?.type || '')) {
          this.mediaFileService.uploadVideo(file).subscribe({
            next: (res) => {
              this.chatService.sendMessage(
                this.tabSelected,
                this.messageService.transformFile(res, file?.type),
                !this.tabPersonal
              );
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      }
    }
    target.value = '';
  }
}
