import { IConversation } from './../../interfaces/conversation';
import { ITab } from './../../interfaces/tab';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  @Input() tabs: IConversation[] = [];
  @Input() currentTab: string = '';
  @Output() currentTabChanged: EventEmitter<string> =
    new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  changeTab(conversationCode: string) {
    this.currentTabChanged.emit(conversationCode);
  }
}
