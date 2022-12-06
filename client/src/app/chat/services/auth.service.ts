import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtData } from '../interfaces/jwt-data';
import { AppUser } from '../interfaces/app-user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  REST_API = environment.baseUrl;
  VERSION = environment.version;
  authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    const jwt = this.storageService.getTokenFromLocal('cc_access_token');
    if (!new JwtHelperService().isTokenExpired(jwt)) {
      this.authenticated.next(true);
    }
  }

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
  logout() {
    this.authenticated.next(false);
    this.storageService.removeTokenToLocal('cc_access_token');
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
}
