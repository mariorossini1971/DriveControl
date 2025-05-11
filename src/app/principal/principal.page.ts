import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';


@Component({
    selector: 'app-principal',
    templateUrl: './principal.page.html',
    styleUrls: ['./principal.page.scss'],
    standalone: false
})
export class PrincipalPage implements OnInit {

  rol: string | null = 'conductor';
  usuario: any;
 //   public usuario: Usuario = new Usuario(0,'', '','','',0);
   public usuarioRecuperado: Usuario = new Usuario(0,'','','','',0);

  private subscripciones = new Subscription(); 
  

  constructor(
     private apiService: ApiService,
     public router: Router,   
     private cdr: ChangeDetectorRef, 
  ) { }

  ngOnInit() { 
    this.controlRol();
    this.usuarioGuardado();
     if (Capacitor.isNativePlatform()) {
      StatusBar.setBackgroundColor({ color: '#FFFFFF' }); 
    }
  }
  ionViewWillEnter(){
    this.usuarioGuardado();
    this.controlRol();
  }

  iniciarViaje(){
 this.router.navigate(['/home']);
  }

  verUsuario(usuario:any){
    if(this.rol === 'conductor'){
      this.recuperaUsuario(this.usuario.id_usuario);
       this.router.navigate(['/usuario-detalle'],{ state: {usuario, modo: 'ver' } });
    }else{
    this.router.navigate(['/usuarios']);
    }
  }

  verVehiculos(){
    // /Uso queryParams para que los datos persistan cuando recargo
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
        this.apiService.getRol().subscribe(rol => {
        this.rol = rol;
      });
    } 


  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario para el footer
    console.log('usuario: ',this.usuario);
  } else {
    console.warn('Usuario no encontrado.');
  }
  }

  cerrarSesion(){
     this.apiService.cerrarSesion();
     this.router.navigate(['/login']);
  }
  recuperaUsuario(id: number) {
  this.subscripciones.add (
    this.apiService.getUsuarioById(id).subscribe({
      next: (data) => { 
        this.usuarioRecuperado.id_usuario = data.id_usuario;
        this.usuarioRecuperado.nombre = data.nombre;
        this.usuarioRecuperado.correo = data.correo;
        this.usuarioRecuperado.contrasena = data.contrasena;
        this.usuarioRecuperado.rol= data.rol;
        this.usuarioRecuperado.telefono = data.telefono;
      },
      error: (error) => {
        console.error('Error al recuperar el usuario:', error);
      },
      complete: () => {
        console.log('Proceso de recuperación completado');
      }
    })
  );
  this.cdr.detectChanges();
}
}
