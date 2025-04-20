import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { Usuario } from '../models/usuario.model';


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
  idUsuario: number = 0;

  filtroTexto: string = '';
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A



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
  //  console.log("control =", this.control);
    // Recupero el Id del Usuario
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioId = JSON.parse(usuario); // Convertir JSON a objeto
      this.idUsuario = usuarioId.id_usuario;
    } else {
      console.log('No se encontró información de usuario en localStorage');
    }

    if (this.rol === 'admin') {
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
     

    } else if(this.rol === 'conductor'){

      this.apiService.getViajesById(this.idUsuario).subscribe({
        next: (data) => {
          this.viajes = data; // Asignamos los viajes obtenidos
          console.log('Viajes recuperados:', this.viajes);
        },
        error: (error) => {
          console.error('Error al recuperar viajes:', error);
        },
        complete: () => {
          console.log('Consulta de viajes completada');
          this.apiService.LoadingController.dismiss();

        }
      });
     }     
    }

    verViaje(viaje: any){
      this.router.navigate(['/viaje-detalle'],{ state: {viaje, modo: 'ver' } });
    }

    get viajesFiltradosYOrdenados() {
      return this.viajes
        .filter(viajes => {
          const texto = this.filtroTexto.toLowerCase();
          return (
           // viajes.id_viaje.toString().includes(texto) ||
            viajes.nombre_conductor.toLowerCase().includes(texto)
          );
        })
        .sort((a, b) => {
          const valA = a.nombre_conductor.toLowerCase();
          const valB = b.nombre_conductor.toLowerCase();
          
          if (this.ordenDireccion === 'asc') {
            return valA.localeCompare(valB); // Orden ascendente
          } else {
            return valB.localeCompare(valA); // Orden descendente
          }
        });
    }

  }
  
