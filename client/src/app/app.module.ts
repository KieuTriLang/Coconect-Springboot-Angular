import { ChatbarComponent } from './chat/components/chatbar/chatbar.component';
import { TabComponent } from './chat/components/tab/tab.component';
import { ChatMessageComponent } from './chat/components/chat-message/chat-message.component';
import { ChatComponent } from './chat/components/chat/chat.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './chat/pipes/safe-html.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './chat/interceptors/auth.interceptor';
import { NotiItemComponent } from './chat/components/noti-item/noti-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MemberListComponent } from './chat/components/member-list/member-list.component';
import { MemberItemComponent } from './chat/components/member-item/member-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatMessageComponent,
    TabComponent,
    ChatbarComponent,
    SafeHtmlPipe,
    NotiItemComponent,
    MemberListComponent,
    MemberItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
