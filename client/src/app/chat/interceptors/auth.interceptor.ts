import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  REST_API = environment.baseUrl;
  constructor(private storageService: StorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.get('Skip') != undefined) {
      const newHeaders = request.headers.delete('Skip');
      const newRequest = request.clone({ headers: newHeaders });
      return next.handle(newRequest);
    }

    const cloned = request.clone({
      headers: request.headers.set(
        'Authorization',
        'Bearer ' + this.storageService.getTokenFromLocal('cc_access_token')
      ),
    });
    return next.handle(cloned);
  }
}
