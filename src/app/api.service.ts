import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiUrl = 'https://nice-roan-whippet.glitch.me/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public idCoche: number = 0;
  constructor(private http: HttpClient) {
   }

  getUsuarios(): Observable<any> {
    return this.http.get(`${apiUrl}/usuarios`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${apiUrl}/usuarios`, usuario);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/usuarios/${id}`);
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${apiUrl}/usuarios/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${apiUrl}/usuarios/${id}`);
  }

  getVehiculos(): Observable<any> {
    return this.http.get(`${apiUrl}/vehiculos`);
  }

  getViajes(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/viajes`);
  }
  createViaje(viaje: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/viajes`, viaje);
  }

  // Métodos para Vehiculos y Viajes pueden ser añadidos de manera similar.
}

