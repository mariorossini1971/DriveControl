import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';  
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-vehiculo-detalle',
    templateUrl: './vehiculo-detalle.page.html',
    styleUrls: ['./vehiculo-detalle.page.scss'],
    standalone: false
})
export class VehiculoDetallePage implements OnInit {

  private subscripciones = new Subscription(); 
  
  vehiculo: any = {
    id_vehiculo:0, 
    modelo:'', 
    marca:'',
    matricula:'',
    ano:'',
    disponible: true,
  };
  modo: 'crear' | 'ver' | 'verEditor' | 'editar' = 'ver';
  usuario: any;
  historialViajes: any[] = [];
  colorBar: string = '#FFFFFF';
 
  constructor(
    private router: Router,
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {

    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);

    console.log('State recibido: ', state); // Verifica el contenido del estado

    if(state) {
      this.modo = state ['modo'] || 'ver';
      if (state['vehiculo']){
        this.vehiculo = { ...state['vehiculo']};

        console.log('Vehiculo cargado: ', this.vehiculo); // Veifica que el usuario tiene un idr

      } else if ( this.modo === 'editar' || this.modo === 'ver'){
        this.presentAlert('Error', 'No se proporcionó el usuario a editar/ver');
        this.navCtrl.navigateBack('/vehiculos');
      }
    }else{
      // Si no se pasa el estado, redirige de nuevo
      this.presentAlert('Error', 'No se proporcionó el estado del usuario');
      this.navCtrl.navigateBack('/vehiculos');
    }
  }

  guardarVehiculo(){

    console.log("Vehiculo a guardar:", this.vehiculo); // Verifica qué datos estás enviando

    if (!this.vehiculo.modelo || !this.vehiculo.matricula) {
      this.presentAlert('Campos requeridos', 'Debes completar los campos');
      return;
    }
    if (this.modo === 'crear'){
        // Eliminar id_usuario para evitar enviarlo al servidor al crear un nuevo usuario
      const { id, ...vehiculoSinId } = this.vehiculo;
      this.subscripciones.add (
        this.apiService.createVehiculo(vehiculoSinId).subscribe({
          next: () => {
            this.presentAlert('Éxito', 'vehiculo creado correctamente');
            this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });
          },
          error:() => {
            console.error("Error al crear el vehiculo", Error); // Log de error
            this.presentAlert('Error', 'No se pudo crear el vehiculo');
          }
        })
    );
    } 
    
    if (this.modo === 'editar' && this.vehiculo.id_vehiculo){
      this.subscripciones.add (
        this.apiService.updateVehiculo(this.vehiculo.id_vehiculo, this.vehiculo).subscribe({
          next:() => {
            this.presentAlert('Éxito', 'Vehiculo actualizado correctamente');
            this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });
          },
          error:() => {
            this.presentAlert('Error', 'No se pudo actualizar el vehiculo');
          }
        })
    );
    } 
  }

  // 
  async eliminarVehiculo() {
    console.log('ide del vehiculo:      ',this.vehiculo.id_vehiculo);
    if (!this.vehiculo.id_vehiculo) return;
  
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este vehículo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
            this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });

          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.subscripciones.add (
              this.apiService.deleteVehiculo(this.vehiculo.id_vehiculo).subscribe({
                next: () => {
                  this.presentAlert('Eliminado', 'Vehículo eliminado correctamente');
                 // this.navCtrl.navigateBack(['/vehiculos'],{ state: { origen: 'origen' } });
                  this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });

                },
                error: () => {
                  this.presentAlert('Error', 'No se pudo eliminar el vehículo');
                }
              })
          )
          }
        }
      ]
    }); 
    await alert.present();
  }
  
  cancelar(){
    console.log("modo en detalle vehiculo : ",this.modo);
    if(this.modo === 'ver'){
     this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });
    } else if(this.modo === 'editar'){
      this.router.navigate(['/vehiculos'], { queryParams: { origen: 'origen' } });
    }   
  }

  cancelarEdicion() {
    console.log("modo en detalle vehiculo : ",this.modo);
    if(this.modo === 'ver'){
     this.router.navigate(['/vehiculos'], { queryParams: { origen: 'origen' } });
    } else if(this.modo === 'editar'){
      this.router.navigate(['/vehiculos'], { queryParams: { origen: 'dashboard' } });
    }
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

verHistorial() {
  const id = this.vehiculo.id_vehiculo; // Cambia a id_vehiculo si esa es la propiedad correcta
  console.log('ID del vehículo:', id);

  if (id) {
    this.router.navigate(['/historial-viajes'], { state: { idVehiculo: id } });
  } else {
    console.error('ID del vehículo no válido.');
  }
}
ngOnDestroy() {
  this.subscripciones.unsubscribe(); 
}

}
