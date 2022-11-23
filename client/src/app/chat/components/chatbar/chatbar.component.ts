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
  constructor(private fb: FormBuilder, private chatService: ChatService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.form.reset();
    }
  }
}
