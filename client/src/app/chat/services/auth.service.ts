import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtData } from '../interfaces/jwt-data';
import { AppUser } from '../interfaces/app-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  REST_API = environment.baseUrl;
  VERSION = environment.version;
  authenticated = false;
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<JwtData> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post<JwtData>(
      `${this.REST_API}${this.VERSION}/users/login`,
      body.toString(),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Skip: '',
        }),
      }
    );
  }
  register(username: string, password: string): Observable<void> {
    const body = {
      username: username,
      password: password,
    };
    return this.http.post<void>(
      `${this.REST_API}${this.VERSION}/users/register`,
      body,
      {
        headers: new HttpHeaders({ Skip: '' }),
      }
    );
  }
  getInfo(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.REST_API}${this.VERSION}/users/info`);
  }
}
