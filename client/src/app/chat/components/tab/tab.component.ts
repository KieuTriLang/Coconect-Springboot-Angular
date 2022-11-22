import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  @Input() tabSelected: string = '';
  @Input() tabs: { name: string; identityCode: string }[] = [];
  @Output() tabSelectedChange: EventEmitter<string> =
    new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  selectTab(identityCode: string) {
    this.tabSelected = identityCode;
    this.tabSelectedChange.emit(this.tabSelected);
  }
}
