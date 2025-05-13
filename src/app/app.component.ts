import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { AlertController } from '@ionic/angular';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent{

  rol : string | null = '';
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private platform: Platform,
    private alertCtrl: AlertController ) {
    this.muestraSplash();
    this.platform.backButton.subscribeWithPriority(10, () => {
          if (this.router.url === '/home') {
            console.log('En home, no hacemos nada.');
            return;
          }
          if (this.router.url === '/principal') {
           this.cerrarSesion();
           return;
         }
          window.history.back();
        });
  }

    ngOnInit() {
      this.controlRol();
  }

  cerrarSesion(){
    let token = String(localStorage.getItem('token'));
    console.log('Token guardado:', token);             /// ojo borrar
    this.apiService.cerrarSesion();
    token = String(localStorage.getItem('token'));     ///  ojo borrar solo como control
    console.log('Token guardado despues del cierre:', token);   /// borrar
    this.router.navigate(['/login']);
  }
  
  controlRol() {
    console.log('             con localStorage ');
    try {
      this.rol = localStorage.getItem('rol');
      if (this.rol) {
        console.log('************ rol en home: ', this.rol);
      } else {
        console.warn('No se ha encontrado rol en localStorage.');
        this.rol = 'visitante'; //
      }
    } catch (error) {
      console.error('Error al leer el rol desde localStorage:', error);
      this.rol = 'visitante'; 
    }
  }
   vehiculoDash(){
    this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });
   }

  async  muestraSplash(){
      await SplashScreen.show({
      autoHide: true,
      showDuration: 2000,
});
    }
}
