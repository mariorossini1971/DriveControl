import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';

import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';


@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss'],
})

export class ViajesComponent implements OnInit {
  viajes: any[] = [];
  control: number = 0;
  mensajeLoading: string = 'cargando datos..';
  rol : string | null = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    console.log('            entro en viajes');
    this.controlRol();
    this.apiService.loading(this.mensajeLoading);
    this.loadViajes();
   // console.log('control: ',this.control);
  }

  controlRol() {
    console.log('             con localStorage ');
    try {
      this.rol = localStorage.getItem('rol');
      if (this.rol) {
        console.log('************ rol en vehiculos: ', this.rol);
      } else {
        console.warn('No se ha encontrado rol en localStorage.');
        this.rol = 'visitante'; //
      }
    } catch (error) {
      console.error('Error al leer el rol desde localStorage:', error);
      this.rol = 'visitante'; 
    }
  }


  loadViajes() {
  // this.apiService.loading(this.mensajeLoading);
    console.log("control =", this.control);
    if (this.control === 0) {
      this.apiService.getViajes().subscribe({
        next: (data: any[]) => {
          this.viajes = data.sort((a, b) => a.id_viaje - b.id_viaje); // Ordenar por id_viaje
        },
        error: (error) => {
          console.error("Error al cargar los viajes:", error);
          this.apiService.LoadingController.dismiss();
        },
        complete: () => {
          this.apiService.LoadingController.dismiss(); // Dismiss cuando el observable completa
        }
      });
    } else {
      this.apiService.LoadingController.dismiss();
    }
  }

/*   eliminarViaje(id_viaje: number) {
    if (this.rol === 'admin') {
      if (confirm('¿Estás seguro de eliminar este viaje?')) {

        this.apiService.deleteViaje(id_viaje).subscribe(
          () => {
            this.loadViajes(); // Actualizamos la lista de viajes después de eliminar
            alert('Viaje eliminado');
          },
          (error: any) => {
            console.error('Error al eliminar el viaje:', error);
          }
        );
      }
    } else {
      alert('No tienes permiso para eliminar este viaje');
    }
  }

  verDetalles(viaje: any) {
    this.router.navigate(['/viaje-detalle'], { state: { viaje } });
  } */

  

}


