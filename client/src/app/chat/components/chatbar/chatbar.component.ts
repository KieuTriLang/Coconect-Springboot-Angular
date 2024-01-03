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
import { NotiType } from '../../data/noti-type.data';

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

  countPress: number = 0;
  constructor(
    private fb: FormBuilder,
    public chatService: ChatService,
    private commandService: CommandService,
    private mediaFileService: MediaFileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      message: ['', [Validators.required]],
    });
    this.commandService.sendCommandText$.subscribe({
      next: value =>{
        if(value != ''){
          this.form.setValue({
            message: `${value} ${this.form.value.message || ''}`
          })
        }
      }
    })
    this.commandService.sendUserInfo$.subscribe({
      next: value =>{
        if(value != ''){
          this.form.setValue({
            message: `${this.form.value.message || ''} ${value}`
          })
        }
      }
    })
    
  }
  typing() {
    if (this.countPress / 5 == 1) {
      // this.chatService.sendTyping(this.tabSelected, !this.tabPersonal);
      this.countPress = 0;
    } else {
      this.countPress++;
    }
  }
  submit() {
    if (this.form.valid && this.chatService.connected$) {
      const text = this.form.value.message;
      if (!this.commandService.notPrefixCommand(text)) {
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
    const { createRoom, addMember, removeMember, leaveRoom, memberList, promoteMember } =
      this.commandService.prefixCommandRegex;

    if (newText.length == 0 && !leaveRoom.regex.test(text)) {
      return;
    }
    switch (true) {
      
      case createRoom.regex.test(text):
        createRoom.action({
          roomCode: '',
          roomName: nameList.join(' '),
          members: [],
        });
        break;
      case addMember.regex.test(text) && this.tabSelected != 'public':
        addMember.action({
          roomCode: this.tabSelected,
          roomName: '',
          members: nameList,
        });
        break;
      case removeMember.regex.test(text) && this.tabSelected != 'public':
        removeMember.action({
          roomCode: this.tabSelected,
          roomName: '',
          members: nameList,
        });
        break;
      case leaveRoom.regex.test(text) && this.tabSelected != 'public':
        leaveRoom.action({
          roomCode: this.tabSelected,
          roomName: '',
          members: [],
        });
        break;
      case memberList.regex.test(text) && this.tabSelected != 'public':
        
        memberList.action({
          roomCode: this.tabSelected,
          roomName: '',
          members: [],
        });
        break;
      case promoteMember.regex.test(text) && this.tabSelected != 'public' && nameList.length == 1:
        promoteMember.action({
          roomCode: this.tabSelected,
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
                this.messageService.transformFile(res.fileCode, res.type),
                !this.tabPersonal
              );
              this.chatService.uploadError = null;
            },
            error: (err) => {
              this.chatService.uploadError = {
                type: NotiType['danger'],
                content: 'Upload file failed! File size must smaller 400MB!',
                roomCode: '',
                roomName: '',
                time: '',
                status: '',
              };
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
                this.messageService.transformFile(res.fileCode, res.type),
                !this.tabPersonal
              );
              this.chatService.uploadError = null;
            },
            error: (err) => {
              this.chatService.uploadError = {
                type: NotiType['danger'],
                content: 'Upload file failed! File size must smaller 400MB!',
                roomCode: '',
                roomName: '',
                time: '',
                status: '',
              };
            },
          });
        }
      }
    }
    target.value = '';
    this.attachmentOpen = false;
  }
}
