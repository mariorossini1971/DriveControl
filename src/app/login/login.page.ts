import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {ApiService} from '../api.service';
import { delay, Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../models/usuario.model';


const TOKEN = '';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  public showPassword = false;
  public passwordIcono = 'eye';
  public email = '';
  public password = '';
  public correo = '';
  public contrasena = '';
  public mensajeLoading = 'Iniciando sesión..';
  public usuario: Usuario = new Usuario(0,'', '','','');
  private rol$: Subscription = new Subscription();
  public rol2: string = '';

  constructor(
    private apiService: ApiService, 
    public router: Router, 
    public alertController: AlertController) { }

  public username: string = '';

ngOnInit() {
  const userEmail = this.email;
  this.username = this.userName(userEmail);
}

  public userName(email: string): string {               ///////  CONTROLAR, porque si uso solo el nombre no me hace falta
    const name = email.indexOf('@');
    if (name !== -1) {
      return email.substring(0, name);
    }
    return email;
  }
  public muestraPassword():void{
     this.showPassword = !this.showPassword;
    if(this.passwordIcono == 'eye'){
      this.passwordIcono = 'eye-off';
    }else {
      this.passwordIcono = 'eye';
    }
  
  }

  iniciarSesion() {

    console.log(" inicia sesion");
    this.apiService.loading(this.mensajeLoading);   // efecto loading

    this.apiService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.apiService.LoadingController.dismiss();      /// quito efecto loading
        
        console.log('Inicio de sesión OK !! :', response);

        this.usuario.rol = response.usuario.rol;          // capturo el rol 
        this.usuario.id_usuario = response.usuario.id_usuario;
        this.usuario.nombre = response.usuario.nombre;
        
        
        console.log('*************************************rol usuario: ', this.usuario.rol);

        this.apiService.setRol(this.usuario.rol);       ////       oooooooojjjjjjoooooo mirar cual uso al final
       
        localStorage.setItem('usuario', JSON.stringify(this.usuario));   /////// pruebas

        this.apiService.LoadingController.dismiss(); 
       
        localStorage.setItem('token', response.token); // Guardar el token en memoria local
        localStorage.setItem('rol',response.usuario.rol); // Guardar el rol en memoria local
   
        const token = String(localStorage.getItem('token'));
        console.log('Token guardado:', token);

        this.apiService.setUsuarioObs(this.usuario);

        this.apiService.getUsuarioObs().subscribe(user => {
          console.log('Usuario recibido:', user);
          let prueba = user.nombre;
          console.log('prueba nombre:', prueba);
        });
      
        this.tokenExpirado(token); /***************************/
        const active = document.activeElement as HTMLElement;
        if(active){
          active.blur();
        }
        this.router.navigate(['/home']); // Navegar a la página principal
      },
      error: async (err) => {
        this.apiService.LoadingController.dismiss();       /// quito efecto loading
        console.error('Error al iniciar sesión:', err);
        const alert = await this.alertController.create({
          message: 'Email / Password \n Invalido',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.email = '';
        this.password = '';
      }
    });
    
  }

  tokenExpirado(token: string): boolean {
    if(!token){
      console.log("no hay token");
      return true;
    }
    const payload = jwtDecode(token); // Decodificar el contenido del token.
    const exp: any = payload.exp; // Recuperar la fecha de expiración.
    const ahora = Math.floor(Date.now() / 1000); // Convertir la fecha actual a formato Unix.

    const fechaExpiracion = new Date(exp * 1000);
    console.log("Fecha de expiración legible: ", fechaExpiracion.toLocaleString());
    return exp < ahora; // Comparar si el token ha expirado.
  }
  
}



