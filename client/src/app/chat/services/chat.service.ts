import { ChatMessage } from './../models/chat-message';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Client, Message, over } from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}
}
