import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-vehiculo-detalle',
  templateUrl: './vehiculo-detalle.page.html',
  styleUrls: ['./vehiculo-detalle.page.scss'],
})
export class VehiculoDetallePage implements OnInit {
  vehiculo: any = {
    id_vehiculo:0, 
    modelo:'', 
    marca:'',
    matricula:'',
    ano:'',
    disponible: true,
  };
  modo: 'crear' | 'ver' | 'editar' = 'ver';
 
  constructor(
    private router: Router,
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    console.log('State recibido: ', state); // Verifica el contenido del estado

    if(state) {
      this.modo = state ['modo'] || 'ver';
      if (state['vehiculo']){
        this.vehiculo = { ...state['vehiculo']};

        console.log('Usuario cargado: ', this.vehiculo); // Verifica que el usuario tiene un id

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

      this.apiService.createVehiculo(vehiculoSinId).subscribe({
        next: () => {
          this.presentAlert('Éxito', 'vehiculo creado correctamente');
          this.navCtrl.navigateBack(['/vehiculos']);
        },
        error:() => {
          console.error("Error al crear el vehiculo", Error); // Log de error
          this.presentAlert('Error', 'No se pudo crear el vehiculo');
        }
      });
    } 
    
    if (this.modo === 'editar' && this.vehiculo.id_vehiculo){
      this.apiService.updateVehiculo(this.vehiculo.id_vehiculo, this.vehiculo).subscribe({
        next:() => {
          this.presentAlert('Éxito', 'Vehiculo actualizado correctamente');
          this.navCtrl.navigateBack(['/vehiculos']);
        },
        error:() => {
          this.presentAlert('Error', 'No se pudo actualizar el vehiculo');
        }
      });
    } 
  }

  eliminarVehiculo(){
    if(!this.vehiculo.id_vehiculo) return;

    this.apiService.deleteVehiculo(this.vehiculo.id_vehiculo).subscribe({
      next: () => {
        this.presentAlert('Eliminado', 'Vehiculo eliminado correctamente');
        this.navCtrl.navigateBack('/usuarios');
      },
      error:() => {
        this.presentAlert('Error', 'No se pudo eliminar el vehiculo');
      }
    });
  }

  cancelar(){
    this.navCtrl.navigateBack(['/vehiculos']);
  }

  cancelarEdicion() {
    this.modo = 'ver'; // Cambiar de vuelta al modo de vista (no edición)
    // Otras acciones de cancelación, si es necesario, como restablecer campos
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
