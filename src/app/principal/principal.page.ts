import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  rol: string | null = 'conductor';
  bloqueoPagina: boolean = false;

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
    this.controlRol();
    console.log('rol en principal: ', this.rol);
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
}
