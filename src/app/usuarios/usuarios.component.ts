import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { delay, filter, Subscribable, Subscription } from 'rxjs';
import {  NavigationEnd, Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnDestroy {

 // usuarioRecuperado: any = {};

  usuarios: any[] = [];

  rol : string | null = '';
  nombre : string | null = '';
  id : number = 0 ;

  filtroTexto: string = '';
  /* criterioOrden: 'nombre' = 'nombre';  // Solo por nombre */
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A

  public usuario: Usuario = new Usuario(0,'', '','','');
  public usuarioRecuperado: Usuario = new Usuario(0,'','','','');

  private subscription: Subscription = new Subscription;
  private routerSubscription!: Subscription;

  
  constructor(
    private apiService: ApiService,
    private router: Router,
    ) { }

  ngOnInit() {
    console.log('entro en Usuario.ts');
    this.controlRol();
    this.funcionPrincipal();
    this.recuperaUsuario(this.id);

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
        console.log('*user2 *********** rol en usuario: ', this.rol);
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
  


funcionPrincipal(){
 
  this.apiService.getUsuarios().subscribe(
  (data: any[]) => {
    this.usuarios = data;
    console.log('Usuarios obtenidos:', this.usuarios);
  },
  (error) => {
    console.error('Error al obtener los usuarios:', error);
  }
);
}

recuperaUsuario(id: number){
  this.apiService.getUsuarioById(id).subscribe(
    (data) => {
      this.usuarioRecuperado = new Usuario(
        data.id_usuario,
        data.nombre,
        data.correo,
        data.contrasena,
        data.rol,
      );
    },
    (error) => {
      console.error('Error al recuperar el usuario:', error);
    }
  );
}
verUsuario(usuario: any){
  this.router.navigate(['/usuario-detalle'],{ state: {usuario, modo: 'ver' } });
  
}

nuevoUsuario(){
  this.router.navigate(['/usuario-detalle'], { state: { modo: 'crear' } });
}


}

