import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.apiService.getToken();
    const apiUrl = 'https://nice-roan-whippet.glitch.me/api';

    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.apiService.getToken();
              const clonedReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next.handle(clonedReq);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<{ token: string }>('apiUrl', {}, { headers: { Authorization: `Bearer ${this.apiService.getToken()}` } }).pipe(
      tap(response => {
        sessionStorage.setItem('accessToken', response.token);
      })
    );
  }
}
