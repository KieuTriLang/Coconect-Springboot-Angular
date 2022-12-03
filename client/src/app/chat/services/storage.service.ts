import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public getTokenFromLocal(key: string): string {
    return localStorage.getItem(key) || '';
  }
  public saveTokenToLocal(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public removeTokenToLocal(key: string) {
    localStorage.removeItem(key);
  }
}
