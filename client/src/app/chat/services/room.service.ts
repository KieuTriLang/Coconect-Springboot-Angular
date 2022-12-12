import { Room } from './../interfaces/room';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  REST_API = environment.baseUrl;
  VERSION = environment.version;
  constructor(private http: HttpClient) {}

  createRoom(roomName: string): Observable<Room> {
    return this.http.post<Room>(`${this.REST_API}${this.VERSION}/rooms`, {
      roomName: roomName,
    });
  }
  addMember(roomCode: string, memberNames: string[]): Observable<any> {
    const params = new HttpParams().set('usernames', memberNames.toString());
    return this.http.post<any>(
      `${this.REST_API}${this.VERSION}/rooms/${roomCode}/members`,
      null,
      { params: params }
    );
  }
  removeMember(roomCode: string, memberNames: string[]): Observable<any> {
    const params = new HttpParams().set('usernames', memberNames.toString());
    return this.http.delete<any>(
      `${this.REST_API}${this.VERSION}/rooms/${roomCode}/members`,
      { params: params }
    );
  }
}
