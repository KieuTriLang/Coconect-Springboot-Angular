import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public getTokenFromLocal(key: string): string {
    return sessionStorage.getItem(key) || '';
  }
  public saveTokenToLocal(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  public removeTokenToLocal(key: string) {
    sessionStorage.removeItem(key);
  }
}
