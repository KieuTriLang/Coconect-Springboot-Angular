import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { MemberInfo } from '../../interfaces/member-info';
import { RoomService } from '../../services/room.service';
import { ConversationService } from '../../services/conversation.service';
import { CommandService } from '../../services/command.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  authName !: string;
  memberInfos : MemberInfo [] = [];

  @Output() hasData = new EventEmitter<boolean>();

  constructor(private commandService: CommandService,private chatService:ChatService) { }

  ngOnInit(): void {
    
    this.commandService.getMemberInfo$.subscribe({
      next: (res:MemberInfo[]) =>{
        if(res.length > 0){
          this.authName = this.chatService.userData.username;
          this.memberInfos = res;
          this.hasData.emit(true);
        }
      }
    })
  }

  addUserInfoToMessageInput(username: string){
    if(username == this.authName){
      return;
    }
    this.commandService.sendUserInfo.next(username);
  }

}
