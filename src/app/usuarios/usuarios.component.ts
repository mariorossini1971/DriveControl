import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { delay, Subscribable, Subscription } from 'rxjs';
import {  Router } from '@angular/router';
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

  public usuario: Usuario = new Usuario(0,'', '','','');
  public usuarioRecuperado: Usuario = new Usuario(0,'','','','');

  private subscription: Subscription = new Subscription;

  
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
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error al leer el usuario desde localStorage:', error);
    }
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
        this.usuarioRecuperado = new Usuario(
          data.id_usuario,
          data.nombre,
          data.correo,
          data.contrasena,
          data.rol
        );
      },
      error: (error) => {
        console.error('Error al recuperar el usuario:', error);
      },
      complete: () => {
        console.log('Proceso de recuperación completado');
      }
    });
  }

verUsuario(usuario: any){
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
  }
}

