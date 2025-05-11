import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { delay, filter,Subscribable, Subscription } from 'rxjs';
import {  NavigationEnd,Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';


@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss'],
    standalone: false
})

export class UsuariosComponent implements OnDestroy {

 // usuarioRecuperado: any = {};

  usuarios: any[] = [];

  //rol : string | null = '';
  rol : string = "";
  public rol$ = new BehaviorSubject<string>('');
  nombre : string | null = '';
  id : number = 0 ;

  filtroTexto: string = '';
  /* criterioOrden: 'nombre' = 'nombre';  // Solo por nombre */
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A


  public usuario: Usuario = new Usuario(0,'', '','','',0);
  public usuarioRecuperado: Usuario = new Usuario(0,'','','','',0);

  private subscripciones = new Subscription(); 

  colorBar: string = '#FFFFFF';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private menuCtrl: MenuController,
    ) { }

  ngOnInit() {
    console.log('entro en Usuario.ts');
    this.controlRol()
    this.usuarioGuardado();
    this.activarMenu();  
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
  
    }
    
    ionViewWillEnter(){
      this.controlRol()
      this.usuarioGuardado();
      this.cdr.detectChanges();
      this.activarMenu();  

      if(this.rol === 'admin' || this.rol === 'gestor'){
        this.funcionPrincipal()
      };
      if(this.rol === 'conductor'){
        this.recuperaUsuario(this.id)
      };
 
    }

  controlRol() {
    this.subscripciones.add(
      this.apiService.getRol().subscribe(rol => {
        this.rol = rol;
        this.cdr.detectChanges();
        console.log("Rol = ",this.rol);
      })
    );
  }
  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
    this.id = this.usuario.id_usuario;
    this.rol = this.usuario.rol;      /// ya se que lo busco antes pero así se me actualiza y antes no.
  } else {
    console.warn('Usuario no encontrado.');
  }
  }

  get usuariosFiltradosYOrdenados() {
    return this.usuarios
      .filter(usuario => {
        const texto = this.filtroTexto.toLowerCase();
        return (
          usuario.nombre.toLowerCase().includes(texto) ||
          usuario.correo.toLowerCase().includes(texto) ||
          usuario.rol.toLowerCase().includes(texto)
        );
      })
      .sort((a, b) => {
        const valA = a.nombre.toLowerCase();
        const valB = b.nombre.toLowerCase();
        
        if (this.ordenDireccion === 'asc') {
          return valA.localeCompare(valB); // Orden ascendente
        } else {
          return valB.localeCompare(valA); // Orden descendente
        }
      });
  }
  

  funcionPrincipal() {
    this.subscripciones.add (
      this.apiService.getUsuarios().subscribe({
        next: (data: any[]) => { 
          this.usuarios = data;
          console.log('Usuarios obtenidos:', this.usuarios);
        },
        error: (error) => {
          console.error('Error al obtener los usuarios:', error);
        }
      })
    );
    this.cdr.detectChanges();
  }
  
  

verUsuario(usuario: any){
this.recuperaUsuario(this.id);
 // this.router.navigate(['/usuario-detalle'],{ state: {usuario, modo: 'ver' } });
 this.router.navigate(['/usuario-detalle'],{ state: {usuario, modo: 'ver' } });
}

nuevoUsuario(){
  this.router.navigate(['/usuario-detalle'], { state: { modo: 'crear' } });
}

activarMenu(){
  if (this.rol === 'admin' || this.rol == 'gestor') {
    this.menuCtrl.enable(true, 'menuAdmin'); // Activa el menú de administrador
    this.menuCtrl.enable(false, 'menu'); // Desactiva el menú de conductor
  } else if (this.rol === 'conductor') {
    this.menuCtrl.enable(true, 'menu'); // Activa el menú de conductor
    this.menuCtrl.enable(false, 'menuAdmin'); // Desactiva el menú de administrador
  }
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

ngOnDestroy() {
  this.subscripciones.unsubscribe(); 
}

}

