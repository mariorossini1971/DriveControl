import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  rol: string | null = 'conductor';
  bloqueoPagina: boolean = false;
  usuario: any;
  

  constructor(
     private apiService: ApiService,
    public router: Router,    
  ) { }

  ngOnInit() {
    this.controlRol();
    console.log('rol en principal: ', this.rol);
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);
  }

  iniciarViaje(){
 this.router.navigate(['/home']);
  }
  verUsuario(){
    this.router.navigate(['/usuarios']);
  }
  verVehiculos(){
    this.router.navigate(['/vehiculos']);
  }
  verViajes(){
    this.router.navigate(['/viajes']);

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

  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
  } else {
    console.warn('Usuario no encontrado.');
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
