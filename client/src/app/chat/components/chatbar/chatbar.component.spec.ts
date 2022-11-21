import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbarComponent } from './chatbar.component';

describe('ChatbarComponent', () => {
  let component: ChatbarComponent;
  let fixture: ComponentFixture<ChatbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
