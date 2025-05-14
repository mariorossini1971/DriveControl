import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { NavController, AlertController } from '@ionic/angular';  
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-viaje-detalle',
    templateUrl: './viaje-detalle.page.html',
    styleUrls: ['./viaje-detalle.page.scss'],
    standalone: false
})
export class ViajeDetallePage implements OnInit {

  private subscripciones = new Subscription(); 
  modo: string = 'editar';
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
  comentario:'',
  }

  usuario: any; 
  rol: string = '';

   coordenadas: any = {
    latInicial: 0, 
    lngInicial: 0, 
    latFinal: 0, 
    lngFinal: 0
};


  direccionInicio: string | null = null;
  direccionFinal: string | null = null;
  colorBar: string = '#FFFFFF';

  constructor(
        private router: Router,
        private apiService: ApiService,
        private navCtrl: NavController,
        private alertController: AlertController,
        private http: HttpClient,
        private menuCtrl: MenuController,
        private cdr: ChangeDetectorRef,


  ) { }

  ngOnInit() {
    this.controlRol();
    this.activarMenu();
    this.funcionPrincipal();
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
  }
  
  ionViewWillEnter(){
    this.controlRol();
    this.usuarioGuardado();
  }

  funcionPrincipal(){

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if(state) {
      this.modo = state ['modo'] || 'ver';
      if (state['viaje']){
        this.viaje = { ...state['viaje']};

        console.log('viaje cargado: ', this.viaje);
        this.obtenerUbicacion(this.viaje.id_viaje);

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

  cancelarEdicion() {
    this.modo = 'ver'; // Cambiar de vuelta al modo de vista (no edición)
    this.navCtrl.navigateBack(['/viajes']);

  }
  cancelar(){
    this.navCtrl.navigateBack(['/viajes']);
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

  async obtenerUbicacion(id_viaje: number) {
    let id: number = id_viaje;
    this.subscripciones.add (
      this.apiService.getCoordenadasById(id).subscribe({
        next: (response) => {
          console.log("Coordenadas obtenidas:", response);
          this.coordenadas.lngInicial = response[0].lngInicial;
          this.coordenadas.latInicial = response[0].latInicial;
          this.coordenadas.lngFinal = response[0].lngFinal;
          this.coordenadas.latFinal = response[0].latFinal;

          this.calculadireccion(this.coordenadas.latInicial, this.coordenadas.lngInicial).then(direccion => {
            this.direccionInicio = direccion;
            console.log("Dirección Inicial:", this.direccionInicio);
          }).catch(error => {
            console.error("Error al calcular dirección inicial:", error);
            this.direccionInicio = "Error al obtener dirección";
          });
      
          this.calculadireccion(this.coordenadas.latFinal, this.coordenadas.lngFinal).then(direccion => {
            this.direccionFinal = direccion;
            console.log("Dirección Final:", this.direccionFinal);
          }).catch(error => {
            console.error("Error al calcular dirección Final:", error);
            this.direccionInicio = "Error al obtener dirección";
          });
        },
        error: (error) => {
          console.error("Error al obtener coordenadas:", error);
        }
      })
  );
  }

  calculadireccion(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const apiKey = '57356b10fa564f7188ec06c8a6982641';
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
     // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      this.subscripciones.add (
        this.http.get(url).subscribe({
          next: (data: any) => {
            if (data && data.features.length > 0) {
            //  const numero = data.address.house_number || "Sin número";
              const calle = data.features[0].properties.address_line1 || 'Calle desconocida';
              const ciudad = data.features[0].properties.city || 'Ciudad desconocida';
    
             const direccion = `${calle}, ${ciudad}`;
              resolve(direccion); // Envía la dirección una vez obtenida
            } else {
              console.warn('No se encontraron datos de dirección en la respuesta.');
              resolve('sin nombre de calle');
            }
          },
          error: (error) => {
            console.error('Error obteniendo ubicación', error);
            reject('Error obteniendo ubicación');
          }
        })
    );
    });
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

  controlRol() {
    this.subscripciones.add (
      this.apiService.getRol().subscribe(rol => {
        this.rol = rol;
        console.log("Rol actual   * * * ", this.rol);
      })
    );
    this.cdr.detectChanges();

  }
  ngOnDestroy() {
    this.subscripciones.unsubscribe(); 
  }
  
}
