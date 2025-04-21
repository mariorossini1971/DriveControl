import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { delay, filter,Subscribable, Subscription } from 'rxjs';
import {  NavigationEnd,Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnDestroy {

 // usuarioRecuperado: any = {};

  usuarios: any[] = [];

  //rol : string | null = '';
  rol : string = "";
  nombre : string | null = '';
  id : number = 0 ;

  filtroTexto: string = '';
  /* criterioOrden: 'nombre' = 'nombre';  // Solo por nombre */
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A

  filtroTexto: string = '';
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A

  public usuario: Usuario = new Usuario(0,'', '','','',0);
  public usuarioRecuperado: Usuario = new Usuario(0,'','','','',0);

  private subscription: Subscription = new Subscription;
  private routerSubscription!: Subscription;
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private menuCtrl: MenuController,
    ) { }

  ngOnInit() {

    this.cdr.detectChanges();      // Detectar cambios para actualizar la vista
    console.log('entro en Usuario.ts');
    this.controlRol()
    this.activarMenu();
    this.funcionPrincipal();
    this.recuperaUsuario(this.id);

     // Suscribirse a los eventos de navegación
     this.routerSubscription = this.router.events
     .pipe(filter(event => event instanceof NavigationEnd))
     .subscribe(() => {
       // Cuando vuelve a esta vista, actualiza usuarios
       this.funcionPrincipal();
     });

    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Cuando vuelve a esta vista, actualiza usuarios
        this.funcionPrincipal();
      });
    }

   ngOnDestroy() {

      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
  }

  controlRol() {
    console.log('             con localStorage ');
    try {
      const User = localStorage.getItem('usuario');
      if (User) {
        this.usuario = JSON.parse(User);
        this.rol = this.usuario.rol;
        this.id = this.usuario.id_usuario;
        console.log('*user *********** rol en usuario: ', this.rol);
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error al leer el usuario desde localStorage:', error);
    }
  }
  
  get usuariosFiltradosYOrdenados() {
    return this.usuarios
      .filter(usuario => {
        const texto = this.filtroTexto.toLowerCase();
        return (
          usuario.nombre.toLowerCase().includes(texto) ||
          usuario.correo.toLowerCase().includes(texto)
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
    this.apiService.getUsuarios().subscribe({
      next: (data: any[]) => { 
        this.usuarios = data;
        console.log('Usuarios obtenidos:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }
  
  recuperaUsuario(id: number) {
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
    });
  }

  get usuariosFiltradosYOrdenados() {
    return this.usuarios
      .filter(usuario => {
        const texto = this.filtroTexto.toLowerCase();
        return (
          usuario.nombre.toLowerCase().includes(texto) ||
          usuario.correo.toLowerCase().includes(texto)
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


verUsuario(usuario: any){
this.recuperaUsuario(this.id);
 // this.router.navigate(['/usuario-detalle'],{ state: {usuario, modo: 'ver' } });
 this.router.navigate(['/usuario-detalle'],{ state: {usuario, modo: 'ver' } });
}

nuevoUsuario(){
  this.router.navigate(['/usuario-detalle'], { state: { modo: 'crear' } });
}
activarMenu(){
  if (this.rol === 'admin') {
    this.menuCtrl.enable(true, 'menuAdmin'); // Activa el menú de administrador
    this.menuCtrl.enable(false, 'menu'); // Desactiva el menú de conductor
  } else if (this.rol === 'conductor') {
    this.menuCtrl.enable(true, 'menu'); // Activa el menú de conductor
    this.menuCtrl.enable(false, 'menuAdmin'); // Desactiva el menú de administrador
  }

}


ngOnDestroy() {
  if (this.routerSubscription) {
    this.routerSubscription.unsubscribe();
  }
  }
}

