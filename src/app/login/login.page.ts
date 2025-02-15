import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Route, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(public fireAuth: AngularFireAuth, public router: Router, public alertController: AlertController) { }

  public username: string = '';

ngOnInit() {
  const userEmail = this.email;
  this.username = this.userName(userEmail);
}

  public login(){
  let tempEmail = this.email+"@gmail.com";  // Variable temporal para guardar el email
  let tempPassword = this.password;
    this.fireAuth.signInWithEmailAndPassword(tempEmail, tempPassword)
    .then(res =>{
      console.log("he entrado");
      const username = this.userName(this.email);
    //  this.router.navigate(['/home',{ username: username }]);
    //    this.router.navigate(['/home/'+ username]);
    this.router.navigate(['/home/']);
    })
    .catch(async error =>{
      if (error.code === 'auth/invalid-credential') { 
        console.log("error al entrar: ",error.message);
        const alert = await this.alertController.create({
          message: 'Usuario no registrado',
          buttons: [{
            
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.email = '';
            this.password = '';
          }
      },
        {
          text: 'Crear Cuenta',
          role: 'confirm',
          handler: () =>this.signup(tempEmail,tempPassword)
        }]
        });
        await alert.present();
      } else {
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
  
  public signup(email:string, password:string){
    this.fireAuth.createUserWithEmailAndPassword(email, password)
    .then(async res =>{
      const alert = await this.alertController.create({
        message:  'Usuario creado con éxito',
        buttons: ['Aceptar']
    })
    await alert.present();
    })
    .catch(async error =>{
      const alert = await this.alertController.create({
        message:  'Email / Password \n Invalido',
        buttons: ['Aceptar']
    })
    await alert.present();
    this.email = '';
    this.password = '';
    })
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

}



