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

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.loading(this.mensajeLoading);

    this.loadViajes();
    console.log('control: ',this.control);
    /***Para controlar que vuelvo a la pagina y volver a cargar la lista*/
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("ha entrado otra vez");
        this.control = 1;
       // this.loadViajes();
      }
    });
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
  
/*
  loadViajes() {
    if (this.control !== 0) {
      console.log("Datos ya cargados, no se vuelve a llamar a la API.");
      this.apiService.LoadingController.dismiss();
      return; // Si ya está cargado, no hacemos nada
    }
  
    this.apiService.loading(this.mensajeLoading);
    console.log("Cargando viajes...");
  
    this.apiService.getViajes().subscribe({
      next: (data: any[]) => {
        this.viajes = data.sort((a, b) => a.id_viaje - b.id_viaje); // Ordenar por id_viaje
        this.control = 1; // Marcar como cargado
      },
      error: (error) => {
        console.error("Error al cargar los viajes:", error);
      },
      complete: () => {
        this.apiService.LoadingController.dismiss();
      }
    });
  }
  */
}


