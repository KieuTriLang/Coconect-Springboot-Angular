import { StorageService } from './storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
    
    return this.http.post<JwtData>(
      `${this.REST_API}${this.VERSION}/auth/sign-in`,
      {
        username: username,
        password: password
      },
      {
        headers: new HttpHeaders({
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
      `${this.REST_API}${this.VERSION}/auth/sign-up`,
      body,
      {
        headers: new HttpHeaders({ Skip: '' }),
      }
    );
  }
}
