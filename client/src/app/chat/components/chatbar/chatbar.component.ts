import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.scss'],
})
export class ChatbarComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder) {}

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
