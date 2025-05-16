import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { Usuario } from '../models/usuario.model';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';




@Component({
    selector: 'app-viajes',
    templateUrl: './viajes.component.html',
    styleUrls: ['./viajes.component.scss'],
    standalone: false
})

export class ViajesComponent implements OnInit {

  private subscripciones = new Subscription(); 
  viajes: any[] = [];
 // control: number = 0;
  mensajeLoading: string = 'cargando datos..';
  rol : string | null = '';
  idUsuario: number = 0;

  filtroTexto: string = '';
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A

  usuario: any;
  colorBar: string = '#FFFFFF';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private menuCtrl: MenuController,
    ) { }

  ngOnInit() {

    this.activarMenu();
    this.controlRol();
    this.usuarioGuardado();
    this.apiService.loading(this.mensajeLoading);
    this.loadViajes();   
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
  }

  ionViewWillEnter(){
    this.activarMenu();
    this.controlRol();
    this.usuarioGuardado();
    this.loadViajes();   

  }
  controlRol() {
      this.subscripciones.add(
      this.apiService.getRol().subscribe(rol => {
        this.rol = rol;
      })
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

  loadViajes() {

    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioId = JSON.parse(usuario); // Convertir JSON a objeto
      this.idUsuario = usuarioId.id_usuario;
    } else {
      console.log('No se encontró información de usuario en localStorage');
    }

    if (this.rol === 'admin' || this.rol == 'gestor') {
      this.subscripciones.add(
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
          
        })
    );
    } else if(this.rol === 'conductor'){
      this.subscripciones.add(
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
        })
      );
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
            viajes.marca.toLowerCase().includes(texto) ||
            viajes.nombre_conductor.toLowerCase().includes(texto) ||
            viajes.matricula.includes(texto) ||
            viajes.modelo.toLowerCase().includes(texto)
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
    activarMenu(){
      if (this.rol === 'admin') {
        this.menuCtrl.enable(true, 'menuAdmin'); // Activa el menú de administrador
        this.menuCtrl.enable(false, 'menu'); // Desactiva el menú de conductor
      } else if (this.rol === 'conductor') {
        this.menuCtrl.enable(true, 'menu'); // Activa el menú de conductor
        this.menuCtrl.enable(false, 'menuAdmin'); // Desactiva el menú de administrador
      }
    }
    ngOnDestroy(){
      this.subscripciones.unsubscribe(); 
    }
  }
  
