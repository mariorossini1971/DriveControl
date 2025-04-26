import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {

  idVehiculo: number = 0;
  historialViajes: any[] = [];
  idUsuario: number = 5;
  viaje: any;
  usuario: any;

  viajes: any = {
    id_viaje: 0,
    fecha_inicio: 0,
    fecha_fin: 0,
    nombre_conductor:'',
    marca: '',
    modelo: '',
    matricula: 0,
    ano: 0,
    }
    vehiculos: any = {
      id_vehiculo:0, 
      modelo:'', 
      marca:'',
      matricula:'',
      ano:'',
      disponible: true,
    };

  filtroTexto: string = '';
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A


  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    
              
   ) { }

  ngOnInit() {
    console.log('*******************************entro en historial viaje por Vehiculo');
 //   this.cargarHistorial();
    this.reciboDatos().then(() => {
      console.log('Datos cargados:', this.historialViajes);
    }).catch(error => {
      console.error('Error al cargar los datos:', error);
    });
    this.usuarioGuardado();
  }

  async reciboDatos() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
  
    if (state && state['idVehiculo']) {
      this.idVehiculo = state['idVehiculo'];
      console.log('Id recibido:', this.idVehiculo);
  
      try {
        // Espera a que se resuelva la Promesa
        this.historialViajes = await this.apiService.getHistorialViaje(this.idVehiculo).toPromise();
        console.log('Historial de viajes:', this.historialViajes);
     //   this.idUsuario = this.historialViajes[0].id_usuario;
        console.log('id usuario . . . . . ',this.idUsuario);
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      }
    }
  }
    
  verViaje(id: number){
    this.cargoDatosId(id).then(() => {
          console.log('Datos cargados:', this.viajes);
        }).catch(error => {
          console.error('Error al cargar los datos:', error);
        });

    this.router.navigate(['/viaje-detalle'],{ state: {viaje: this.viaje[0], modo: 'ver' } });
  }

  async cargoDatosId(id: number){
    this.apiService.getViajesByIdDetallado(id).subscribe(
      (data) => {
        this.viaje = data;
        console.log('Viaje detallado recibido:', this.viaje[0]);
      },
      (error) => {
        console.error('Error al cargar el viaje detallado:', error);
      }
    );

  }

  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
  } else {
    console.warn('Usuario no encontrado.');
  }
  }

}
