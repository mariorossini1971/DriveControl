import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { NavController, AlertController } from '@ionic/angular';  


@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.page.html',
  styleUrls: ['./viaje-detalle.page.scss'],
})
export class ViajeDetallePage implements OnInit {
  modo: string = 'deitar';

  vehiculo: any = {
    id_vehiculo:0, 
    modelo:'', 
    marca:'',
    matricula:'',
    ano:'',
    disponible: true,
  };

  viaje: any = {
  id_viaje: 0,
  fecha_inicio: 0,
  fecha_fin: 0,
  nombre_conductor:'',
  marca: '',
  modelo: '',
  matricula: 0,
  ano: 0,
  }

  usuario: any;

  constructor(
        private router: Router,
        private apiService: ApiService,
        private navCtrl: NavController,
        private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.funcionPrincipal();
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);
  }

  funcionPrincipal(){

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if(state) {
      this.modo = state ['modo'] || 'ver';
      if (state['viaje']){
        this.viaje = { ...state['viaje']};

        console.log('Usuario cargado: ', this.viaje); // Verifica que el usuario tiene un id

      } else if ( this.modo === 'editar' || this.modo === 'ver'){
        this.presentAlert('Error', 'No se proporcionó el viaje a editar/ver');
        this.navCtrl.navigateBack('/viajes');
      }
    }else{
      // Si no se pasa el estado, redirige de nuevo
      this.presentAlert('Error', 'No se proporcionó el estado del viaje');
      this.navCtrl.navigateBack('/viajes');

    }

  }
  guardarVehiculo(){}
  cancelarEdicion() {
    this.modo = 'ver'; // Cambiar de vuelta al modo de vista (no edición)
    // Otras acciones de cancelación, si es necesario, como restablecer campos
  }
  cancelar(){
    this.navCtrl.navigateBack(['/vehiculos']);
  }

  eliminarViaje(){
    if(!this.viaje.id_viaje) return;

    this.apiService.deleteViaje(this.viaje.id_viaje).subscribe({
      next: () => {
        this.presentAlert('Eliminado', 'viaje eliminado correctamente');
        this.navCtrl.navigateBack('/viajes');
      },
      error:() => {
        this.presentAlert('Error', 'No se pudo eliminar el viaje');
      }
    });
  }

  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
  } else {
    console.warn('Usuario no encontrado.');
  }
  }
  
  async presentAlert (titulo:string, mensaje:string){
    const alert = await this.alertController.create({
      header:titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
