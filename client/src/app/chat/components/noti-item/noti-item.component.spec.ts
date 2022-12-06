import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiItemComponent } from './noti-item.component';

describe('NotiItemComponent', () => {
  let component: NotiItemComponent;
  let fixture: ComponentFixture<NotiItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotiItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotiItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
