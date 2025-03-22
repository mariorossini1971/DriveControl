import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {ApiService} from '../api.service';

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
    this.apiService.loading(this.mensajeLoading);   // efecto loading
    this.apiService.login1(this.email, this.password).subscribe({
      next: (response: any) => {
        this.apiService.LoadingController.dismiss();       /// quito efecto loading
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem('token', response.token); // Guardar el token en almacenamiento local
        const token = localStorage.getItem('token');
        console.log('Token guardado:', token);
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
}



