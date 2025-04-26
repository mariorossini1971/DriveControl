import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  rol: string | null = 'conductor';
  public rol$ = new BehaviorSubject<string>('');
  bloqueoPagina: boolean = false;
  usuario: any;
  

  constructor(
     private apiService: ApiService,
     public router: Router,   
     private cdr: ChangeDetectorRef, 
  ) { }

  ngOnInit() {
   // this.controlRol();
   this.control2Rol();
    console.log('rol en principal: ', this.rol);
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);
  }
  ionViewWillEnter(){
   // this.controlRol();
   this.control2Rol();
  }

  iniciarViaje(){
 this.router.navigate(['/home']);
  }
  verUsuario(){
    this.router.navigate(['/usuarios']);
  }

  verVehiculos(){
    this.router.navigate(['/vehiculos'], { state: { origen: 'dashboard' } });
   // this.router.navigate(['/vehiculos']);
  }
  verViajes(){
    this.router.navigate(['/viajes']);
  }

  control2Rol(){
    this.apiService.cargarRol();
    this.apiService.rol$.subscribe((rol) => {
      this.rol = rol; // Actualiza el valor local
      console.log('Rol actualizado en HomePage:', this.rol);
    });
  }


  controlRol() {

    try {
      const rolLocalStorage = localStorage.getItem('rol'); 
  
      if (rolLocalStorage) {
        this.rol = rolLocalStorage;
        this.rol$.next(this.rol); // Actualiza el BehaviorSubject
        console.log('************ rol en home: ', this.rol);
        this.cdr.detectChanges();

      } else {
        console.log('No se ha encontrado rol en localStorage.');
        this.rol = 'visitante'; // Asigna rol por defecto
        this.rol$.next(this.rol); // Asegura que el BehaviorSubject reciba el valor
      }
    } catch (error) {
      console.error('Error al leer el rol desde localStorage:', error);
      this.rol = 'visitante'; 
      this.rol$.next(this.rol);
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


//(rol$ | async)