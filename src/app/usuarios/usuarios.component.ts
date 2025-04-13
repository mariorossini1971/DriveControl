import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { delay, Subscribable, Subscription } from 'rxjs';
import {  Router } from '@angular/router';
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

  public usuario: Usuario = new Usuario(0,'', '','','');
  public usuarioRecuperado: Usuario = new Usuario(0,'','','','');

  private subscription: Subscription = new Subscription;

  
  constructor(
    private apiService: ApiService,
    private router: Router,
    ) { }

  ngOnInit() {
    console.log('entro en Usuario.ts');
    this.controlRol();
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
      }
    } catch (error) {
      console.error('Error al leer el usuario desde localStorage:', error);
    }
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

ngOnDestroy() {
  }
}

