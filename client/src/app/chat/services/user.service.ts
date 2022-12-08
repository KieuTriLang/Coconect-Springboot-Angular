import { IChatMessage } from './../interfaces/chat-message';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUser } from '../interfaces/app-user';
import { IConversation } from '../interfaces/conversation';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  REST_API = environment.baseUrl;
  VERSION = environment.version;
  constructor(private http: HttpClient) {}

  getInfo(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.REST_API}${this.VERSION}/users/info`);
  }
  addPrivateConversation(
    senderCode: string,
    receiverCode: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('senderCode', senderCode)
      .set('receiverCode', receiverCode);
    return this.http.post<any>(
      `${this.REST_API}${this.VERSION}/users/conversations`,
      null,
      { params: params }
    );
  }

  getConversations(): Observable<IConversation> {
    return this.http.get<IConversation>(
      `${this.REST_API}${this.VERSION}/users/conversations`
    );
  }

  getMessageRoom(
    roomCode: string,
    beforeId: number | 0
  ): Observable<IChatMessage[]> {
    const params = new HttpParams().set('id', beforeId);
    return this.http.get<IChatMessage[]>(
      `${this.REST_API}${this.VERSION}/messages/room/${roomCode}`,
      { params: params }
    );
  }
  getMessagePrivate(
    receiverCode: string,
    beforeId: number | 0
  ): Observable<IChatMessage[]> {
    const params = new HttpParams().set('id', beforeId);
    return this.http.get<IChatMessage[]>(
      `${this.REST_API}${this.VERSION}/messages/private/${receiverCode}`,
      { params: params }
    );
  }
}
