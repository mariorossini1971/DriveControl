import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

const apiUrl = 'https://nice-roan-whippet.glitch.me/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public idCoche: number = 0; 

  /******Para mantener el valor actualizado ********/
 
  miCocheBehaviorSubject = new BehaviorSubject<string>("sin Coche");
  miIdCocheBehaviorSubject = new BehaviorSubject<number>(0);

  /*****    TODO lo mismo con el id del coche, me será útil ***********/

  constructor(private http: HttpClient) {}

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

  setModeloSeleccionado(modelo: string) {
    // this.objetoModeloSeleccionado.next(modelo);
    this.miCocheBehaviorSubject.next(modelo);
  }

  getModeloSeleccionado() {
    return this.miCocheBehaviorSubject.asObservable();
  }
  setIdCoche(idCoche: number) {
    this.miIdCocheBehaviorSubject.next(idCoche);
  }
  getIdCoche(){
    return this.miIdCocheBehaviorSubject.asObservable();
  }
}


