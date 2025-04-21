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
  usuario: any;
   
  constructor(    
    private apiService: ApiService,
    private router: Router ) {
      this.cargarUsuarioLogueado();
    }

    cargarUsuarioLogueado() {
      // Suponiendo que tienes el ID del usuario almacenado (ej. en localStorage)
      const idUsuario = localStorage.getItem('id_usuario');
      if (idUsuario) {
        this.apiService.getUsuarioById(Number(idUsuario)).subscribe({
          next: (data) => {
            this.usuario = data; // Guardar los datos del usuario
            this.rol = data.rol; // Establecer el rol
            console.log('Usuario cargado:', this.usuario);
          },
          error: (error) => {
            console.error('Error al cargar el usuario logueado:', error);
          },
        });
      } else {
        console.warn('No se encontró ID de usuario en localStorage.');
      }
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

  


  cerrarSesion(){
    let token = String(localStorage.getItem('token'));
    console.log('Token guardado:', token);             /// ojo borrar
    this.apiService.cerrarSesion();
    token = String(localStorage.getItem('token'));     ///  ojo borrar solo como control
    console.log('Token guardado despues del cierre:', token);   /// borrar
    this.router.navigate(['/login']);
  }


}
