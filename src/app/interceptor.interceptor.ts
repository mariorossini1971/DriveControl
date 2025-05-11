 import { Injectable } from '@angular/core';
 import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
 import { Observable, throwError } from 'rxjs';
 import { catchError, switchMap, tap } from 'rxjs/operators';
 import { ApiService } from './api.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private apiUrl = 'https://nice-roan-whippet.glitch.me/api';

//   constructor(private apiService: ApiService, private http: HttpClient) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let authReq = req;
//     const token = this.apiService.getToken();

//     if (token) {
//       authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
//     }

//     return next.handle(authReq).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           console.warn(" Token expirado, intentando renovar...");
//           return this.refreshToken().pipe(
//             switchMap(() => {
//               const newToken = this.apiService.getToken();
//               const clonedReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
//               return next.handle(clonedReq);
//             }),
//             catchError(err => {
//               console.error("Error al renovar el token:", err);
//               this.apiService.cerrarSesion(); // Cerrar sesión si la renovación falla
//               return throwError(() => new Error("Sesión expirada. Requiere login."));
//             })
//           );
//         }
//         return throwError(() => error);
//       })
//     );
//   }

//   refreshToken(): Observable<any> {
//     return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}, {
//       headers: { Authorization: `Bearer ${this.apiService.getToken()}` },
//     }).pipe(
//       tap(response => {
//         if (response?.token) {
//           console.log("Token renovado correctamente.");
//           localStorage.setItem('accessToken', response.token); // Usamos localStorage en lugar de sessionStorage
//         } else {
//           console.warn(" No se recibió un nuevo token.");
//         }
//       }),
//       catchError(error => {
//         console.error("Error al renovar el token:", error);
//         return throwError(() => error);
//       })
//     );
//   }
// }
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiUrl = 'https://nice-roan-whippet.glitch.me/api';
  private enProcesoDeRenovacion = false; // Control para evitar bucles infinitos

  constructor(private apiService: ApiService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.apiService.getToken();

    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn(" Token expirado, intentando renovar...");

          // Si ya se está intentando renovar el token, evitamos otro intento
          if (this.enProcesoDeRenovacion) {
            console.error(" Renovación de token ya en curso. Cancelando nueva solicitud.");
            return throwError(() => new Error("Sesión expirada. Requiere login."));
          }

          this.enProcesoDeRenovacion = true; // estamos renovando el token

          return this.refreshToken().pipe(
            switchMap((newToken) => {
              this.enProcesoDeRenovacion = false; // Renovación completada

              if (!newToken) {
                console.error(" No se pudo renovar el token.");
                this.apiService.cerrarSesion(); // Cerrar sesión
                return throwError(() => new Error("Sesión expirada. Requiere login."));
              }

              // Clonar la petición con el nuevo token y continuar
              const clonedReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next.handle(clonedReq);
            }),
            catchError(err => {
              console.error(" Error al renovar el token:", err);
              this.enProcesoDeRenovacion = false; // Resetear estado
              this.apiService.cerrarSesion(); // Cerrar sesión si la renovación falla
              return throwError(() => new Error("Sesión expirada. Requiere login."));
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<string> {
  return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}, {
    headers: { Authorization: `Bearer ${this.apiService.getToken()}` },
  }).pipe(
    tap(response => {
      if (response?.token) {
        console.log(" Token renovado correctamente.");
        localStorage.setItem('accessToken', response.token);
      } else {
        console.warn(" No se recibió un nuevo token.");
      }
    }),
    switchMap(response => response.token ? new Observable<string>(observer => {
      observer.next(response.token);
      observer.complete();
    }) : throwError(() => new Error("No se pudo renovar el token"))),
    catchError(error => {
      console.error(" Error al renovar el token:", error);
      return throwError(() => new Error("Error al renovar el token"));
    })
  );
}
}
