import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{

  rol : string | null = '';
  
  constructor(
    private apiService: ApiService,
    private router: Router ) {}

  cerrarSesion(){
    let token = String(localStorage.getItem('token'));
    console.log('Token guardado:', token);             /// ojo borrar
    this.apiService.cerrarSesion();
    token = String(localStorage.getItem('token'));     ///  ojo borrar solo como control
    console.log('Token guardado despues del cierre:', token);   /// borrar
    this.router.navigate(['/login']);
  }
  controlRol() {
    console.log('             con localStorage ');
    try {
      this.rol = localStorage.getItem('rol');
      if (this.rol) {
        console.log('************ rol en home: ', this.rol);
      } else {
        console.warn('No se ha encontrado rol en localStorage.');
        this.rol = 'visitante'; //
      }
    } catch (error) {
      console.error('Error al leer el rol desde localStorage:', error);
      this.rol = 'visitante'; 
    }
  }

  
}
