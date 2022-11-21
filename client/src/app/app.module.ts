import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/components/chat/chat.component';
import { ChatMessageComponent } from './chat/components/chat-message/chat-message.component';
import { TabComponent } from './chat/components/tab/tab.component';
import { ChatbarComponent } from './chat/components/chatbar/chatbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatMessageComponent,
    TabComponent,
    ChatbarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
