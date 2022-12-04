import { RoomService } from './room.service';
import { Injectable } from '@angular/core';
import { Room } from '../interfaces/room';
import { IRoomRequest } from '../interfaces/room-request';

interface IObjectKeys {
  [key: string]: ICommandRegex;
}
interface ICommandRegex {
  regex: string;
  action: (room: IRoomRequest) => void;
}
@Injectable({
  providedIn: 'root',
})
export class CommandService {
  prefixCommandRegex!: IObjectKeys;
  constructor(private roomService: RoomService) {
    this.prefixCommandRegex = {
      createRoom: { regex: `^\/CreateRoom:`, action: this.createRoom },
      addMember: { regex: `^\/AddMember:`, action: this.addMember },
      removeMember: { regex: `^\/RemoveMember:`, action: this.removeMember },
    };
  }

  checkAllPrefixCommand(text: string): boolean {
    return new RegExp(this.mergePrefixCommandRegex(), 'i').test(text);
  }

  checkSpecificedPrefixComman(text: string, prefixCommand: string): boolean {
    return new RegExp(prefixCommand, 'i').test(text);
  }

  removeAllPrefix(text: string): string {
    return text.replace(new RegExp(this.mergePrefixCommandRegex(), 'i'), '');
  }

  mergePrefixCommandRegex(): string {
    let regex = '';
    for (const key in this.prefixCommandRegex) {
      if (Object.prototype.hasOwnProperty.call(this.prefixCommandRegex, key)) {
        const element = this.prefixCommandRegex[key].regex;
        regex += `${element}|`;
      }
    }
    return regex;
  }
  createRoom = ({ roomName }: IRoomRequest) => {
    this.roomService.createRoom(roomName).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  };
  addMember = ({ roomCode, members }: IRoomRequest) => {
    this.roomService.addMember(roomCode, members).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  };
  removeMember = ({ roomCode, members }: IRoomRequest) => {
    this.roomService.removeMember(roomCode, members).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  };
}
