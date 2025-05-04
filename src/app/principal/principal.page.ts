import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-principal',
    templateUrl: './principal.page.html',
    styleUrls: ['./principal.page.scss'],
    standalone: false
})
export class PrincipalPage implements OnInit {

  rol: string | null = 'conductor';
 // public rol$ = new BehaviorSubject<string>('');
  bloqueoPagina: boolean = false;
  usuario: any;
  

  constructor(
     private apiService: ApiService,
     public router: Router,   
     private cdr: ChangeDetectorRef, 
  ) { }

  ngOnInit() { 
 //   this.controlRol();
    this.usuarioGuardado();
  }
  ionViewWillEnter(){
    this.controlRol();
  }

  iniciarViaje(){
 this.router.navigate(['/home']);
  }

  verUsuario(){
    this.router.navigate(['/usuarios']);
  }

  verVehiculos(){
    // this.router.navigate(['/vehiculos'], { state: { origen: 'dashboard' } });
    this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });

  }

  verViajes(){
    this.router.navigate(['/viajes']);
  }

  verHelpConductor(){
    this.router.navigate(['/help-conductor']);
  }

  verHelpAdministrador(){
    this.router.navigate(['/help-administrador']);
  }

  verHelpGestor(){
    this.router.navigate(['/help-gestor']);
  }

  controlRol(){
    //  this.apiService.cargarRol();
    // this.apiService.rol$.subscribe((rol) => {
    //   this.rol = rol; // Actualiza el valor local
    //   console.log('Rol actualizado en HomePage:', this.rol);
    // });
      this.apiService.getRol().subscribe(rol => {
        this.rol = rol;
        console.log("Rol actual   * * * ", this.rol);
      });
    } 


  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario para el footer
  } else {
    console.warn('Usuario no encontrado.');
  }
  }

  cerrarSesion(){
 //   let token = String(localStorage.getItem('token'));
 //   console.log('Token guardado:', token);             /// ojo borrar
    this.apiService.cerrarSesion();
 //   token = String(localStorage.getItem('token'));     ///  ojo borrar solo como control
 //   console.log('Token guardado despues del cierre:', token);   /// borrar
    this.router.navigate(['/login']);
  }
  
}
