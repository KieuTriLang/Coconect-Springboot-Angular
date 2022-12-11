import { IMediaFileResponse } from './../interfaces/media-file-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaFileService {
  REST_API = environment.baseUrl;
  VERSION = environment.version;
  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<IMediaFileResponse> {
    let fd = new FormData();
    fd.append('file', file);
    return this.http.post<IMediaFileResponse>(
      `${this.REST_API}${this.VERSION}/media-file/image`,
      fd
    );
  }
  uploadVideo(file: File): Observable<IMediaFileResponse> {
    let fd = new FormData();
    fd.append('file', file);
    return this.http.post<IMediaFileResponse>(
      `${this.REST_API}${this.VERSION}/media-file/video`,
      fd
    );
  }
}
