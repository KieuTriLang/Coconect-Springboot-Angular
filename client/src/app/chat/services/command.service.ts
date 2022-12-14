import { ConversationService } from './conversation.service';
import { ChatService } from './chat.service';
import { RoomService } from './room.service';
import { Injectable } from '@angular/core';
import { IRoomRequest } from '../interfaces/room-request';
import { NotiType } from '../data/noti-type.data';

interface IObjectKeys {
  [key: string]: ICommandRegex;
}
interface ICommandRegex {
  regex: RegExp;
  action: (room: IRoomRequest) => void;
}
@Injectable({
  providedIn: 'root',
})
export class CommandService {
  prefixCommandRegex!: IObjectKeys;
  constructor(
    private roomService: RoomService,
    private chatService: ChatService,
    private conversationService: ConversationService
  ) {
    this.prefixCommandRegex = {
      createRoom: {
        regex: new RegExp(`^\/CreateRoom:`),
        action: this.createRoom,
      },
      addMember: { regex: new RegExp(`^\/AddMember:`), action: this.addMember },
      removeMember: {
        regex: new RegExp(`^\/RemoveMember:`),
        action: this.removeMember,
      },
      leaveRoom: { regex: new RegExp(`\/LeaveRoom:`), action: this.leaveRoom },
    };
  }

  notPrefixCommand(text: string): boolean {
    for (const key in this.prefixCommandRegex) {
      if (Object.prototype.hasOwnProperty.call(this.prefixCommandRegex, key)) {
        if (this.prefixCommandRegex[key].regex.test(text)) {
          return false;
        }
      }
    }
    return true;
  }

  checkSpecificedPrefixComman(text: string, prefixCommand: string): boolean {
    return new RegExp(prefixCommand, 'i').test(text);
  }

  removeAllPrefix(text: string): string {
    for (const key in this.prefixCommandRegex) {
      if (Object.prototype.hasOwnProperty.call(this.prefixCommandRegex, key)) {
        if (this.prefixCommandRegex[key].regex.test(text)) {
          text = text.replace(this.prefixCommandRegex[key].regex, '');
        }
      }
    }
    return text;
  }

  // mergePrefixCommandRegex(): string {
  //   let regex = '';
  //   let lastKey = Object.keys(this.prefixCommandRegex).pop();
  //   for (const key in this.prefixCommandRegex) {
  //     if (Object.prototype.hasOwnProperty.call(this.prefixCommandRegex, key)) {
  //       const element = this.prefixCommandRegex[key].regex;

  //       regex += key == lastKey ? `${element}` : `${element}|`;
  //     }
  //   }
  //   return regex;
  // }
  createRoom = ({ roomName }: IRoomRequest) => {
    this.roomService.createRoom(roomName).subscribe({
      next: (res) => {
        this.conversationService.createNewTab(
          {
            id: null,
            conversationCode: res.roomCode,
            name: res.roomName,
            unread: 0,
            personal: false,
          },
          false,
          true
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  };
  addMember = ({ roomCode, members }: IRoomRequest) => {
    this.roomService.addMember(roomCode, members).subscribe({
      next: (res) => {
        this.chatService.uploadError = {
          type: NotiType['checked'],
          content: 'Invite successfully!',
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
      error: (err) => {
        this.chatService.uploadError = {
          type: NotiType['danger'],
          content: 'Invite failed!',
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
    });
  };
  removeMember = ({ roomCode, members }: IRoomRequest) => {
    this.roomService.removeMember(roomCode, members).subscribe({
      next: (res) => {
        this.chatService.uploadError = {
          type: NotiType['checked'],
          content: 'Kick successfully!',
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
      error: (err) => {
        this.chatService.uploadError = {
          type: NotiType['danger'],
          content: 'Kick failed!',
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
    });
  };
  leaveRoom = ({ roomCode }: IRoomRequest) => {
    this.roomService.leaveRoom(roomCode).subscribe({
      next: (res) => {
        this.chatService.uploadError = {
          type: NotiType['checked'],
          content: 'Leave successfully!',
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
      error: (err) => {
        this.chatService.uploadError = {
          type: NotiType['danger'],
          content: 'Leave failed!',
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
    });
  };
}
