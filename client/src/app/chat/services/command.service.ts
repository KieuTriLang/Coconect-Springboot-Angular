import { ConversationService } from './conversation.service';
import { ChatService } from './chat.service';
import { RoomService } from './room.service';
import { Injectable } from '@angular/core';
import { IRoomRequest } from '../interfaces/room-request';
import { NotiType } from '../data/noti-type.data';
import { BehaviorSubject } from 'rxjs';
import { MemberInfo } from '../interfaces/member-info';

interface IObjectKeys {
  [key: string]: ICommandRegex;
}
export interface ICommandRegex {
  name: string;
  value: string;
  regex: RegExp;
  action: (room: IRoomRequest) => void;
}
@Injectable({
  providedIn: 'root',
})
export class CommandService {
  sendCommandText = new BehaviorSubject<string>('');
  sendCommandText$ = this.sendCommandText.asObservable();
  sendUserInfo = new BehaviorSubject<string>('');
  sendUserInfo$ = this.sendUserInfo.asObservable();
  getMemberInfo = new BehaviorSubject<MemberInfo[]>([]);
  getMemberInfo$ = this.getMemberInfo.asObservable();
  prefixCommandRegex!: IObjectKeys;

  constructor(
    private roomService: RoomService,
    private chatService: ChatService,
    private conversationService: ConversationService
  ) {
    this.prefixCommandRegex = {
      createRoom: {
        name: 'Create new room chat',
        value: '/CreateRoom:',
        regex: new RegExp(/^\/CreateRoom:/),
        action: this.createRoom,
      },
      addMember: {
        name: 'Add new member',
        value: '/AddMember:',
        regex: new RegExp(/^\/AddMember:/),
        action: this.addMember,
      },
      removeMember: {
        name: 'Kick out member',
        value: '/KickMember:',
        regex: new RegExp(/^\/KickMember:/),
        action: this.removeMember,
      },
      leaveRoom: {
        name: 'Leave room chat',
        value: '/LeaveRoom:',
        regex: new RegExp(/^\/LeaveRoom:/),
        action: this.leaveRoom,
      },
      memberList: {
        name: 'Show member of room',
        value: '/Members:',
        regex: new RegExp(/^\/Members:/),
        action: this.getMemberOfRoom,
      },
      promoteMember: {
        name: 'Promote member',
        value: '/Promote:',
        regex: new RegExp(/^\/Promote:/),
        action: this.promoteMember,
      },
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
          true,
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
        console.log(err);
        this.chatService.uploadError = {
          type: NotiType['danger'],
          content: err.error.message,
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
          content: err.error.message,
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
      next: (res: boolean) => {
        if (res) {
          this.chatService.uploadError = {
            type: NotiType['checked'],
            content: 'Leave successfully!',
            roomCode: '',
            roomName: '',
            time: '',
            status: '',
          };
          this.chatService.unsubscribeRoom(roomCode);
          this.conversationService.removeConversation(roomCode);
        }
      },
      error: (err) => {
        this.chatService.uploadError = {
          type: NotiType['danger'],
          content: err.error.message,
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
    });
  };
  getMemberOfRoom = ({ roomCode }: IRoomRequest) => {
    this.roomService.getMemberOfRoom(roomCode).subscribe({
      next: (res: MemberInfo[]) => {
        this.getMemberInfo.next(res);
      },
      error: (err) => {
        this.chatService.uploadError = {
          type: NotiType['danger'],
          content: err.error.message,
          roomCode: '',
          roomName: '',
          time: '',
          status: '',
        };
      },
    });
  };

  promoteMember = ({ roomCode, members }: IRoomRequest) => {
    if (members.length == 1) {
      this.roomService.promoteMember(roomCode, members[0]).subscribe({
        next: (res: boolean) => {
          if (res) {
            this.getMemberInfo.next(
              this.getMemberInfo.getValue().map((mi) => {
                if (mi.username == members[0]) {
                  mi.master = true;
                  return mi;
                } else {
                  mi.master = false;
                  return mi;
                }
              })
            );
          }
        },
        error: (err) => {
          this.chatService.uploadError = {
            type: NotiType['danger'],
            content: err.error.message,
            roomCode: '',
            roomName: '',
            time: '',
            status: '',
          };
        },
      });
    } else {
      this.chatService.uploadError = {
        type: NotiType['danger'],
        content: 'You only can promote one member!',
        roomCode: '',
        roomName: '',
        time: '',
        status: '',
      };
    }
  };
}
