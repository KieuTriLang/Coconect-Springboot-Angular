import { Component, Input, OnInit } from '@angular/core';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { MemberInfo } from '../../interfaces/member-info';
import { ConversationService } from '../../services/conversation.service';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {
  @Input() member!: MemberInfo;
  @Input() authName!: string;
  iconCrown = faCrown;
  isOpenAction: boolean = false;
  constructor(private conversationService:ConversationService,private commandService:CommandService) {}

  ngOnInit(): void {}

  openNewChat() {
    this.conversationService.createNewTab(
      {
        id: null,
        conversationCode: this.member.userCode,
        name: this.member.username,
        unread: 0,
        personal: true,
      },
      true,
      true
    );
  }
  addUserInfoToMessageInput() {
    this.commandService.sendUserInfo.next(this.member.username);
  }
}
