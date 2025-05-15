import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-guardar',
    templateUrl: './guardar.page.html',
    styleUrls: ['./guardar.page.scss'],
    standalone: false
})

export class GuardarPage implements OnDestroy{

  private subscripciones = new Subscription(); 
  idViaje: number = 0;
  viaje$ = new BehaviorSubject<any>({
    id_viaje: 0,
    id_usuario: '',
    id_vehiculo: '',
    fecha_inicio: '',
    fecha_fin: '',
    comentario: '',
  });

  coordenadas$ = new BehaviorSubject<any>({
    viaje_id: 0,
    latInicial: 0,
    lngInicial: 0,
    latFinal: 0,
    lngFinal: 0,
  });

  public usuario: Usuario = new Usuario(0,'', '','','',0);
 
  colorBar: string = '#FFFFFF';
  mensaje: string = '';
  datosGuardados: boolean = true;

  constructor(
        public activateRoute: ActivatedRoute,
        private apiService: ApiService, 
        public router: Router,
        private cdRef: ChangeDetectorRef 
  ) { }

  ngOnInit() {
    this.usuarioGuardado();
    this.funcionPrincipal();
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
          this.apiService.setStatusBarColor(this.colorBar);
        };
  }

  funcionPrincipal(){
    this.subscripciones.add (
      this.apiService.getNewItem().subscribe({
        next: (viaje) => {
          console.log('viaje seleccionado:', viaje);

          // Si no hay comentario, valor predeterminado
          if (!viaje.comentario || viaje.comentario.trim() === '') {
            viaje.comentario = '';
          }
      // Verifico si el comentario contiene 'no hay comentarios' y lo reemplazo por vacío
          if (viaje.comentario === 'no hay comentarios') {
            viaje.comentario = ''; // Lo dejo vacío para que se vea el placeholder
          }
          this.viaje$.next(viaje);       // vuelvo a cargar el viaje con los comentarios para luego subirlo a la BBDD
          console.log('comentario', this.viaje$.getValue().comentario)
        },
        error: (err) => {
          console.error('Error al recuperar el viaje:', err);
        },
        complete: () => {
          console.log('viaje recuperado.');
        },
      })
    );
    this.subscripciones.add(
      this.apiService.getNewCoordenadas().subscribe({
        next: (coordenadas) => {
          this.coordenadas$.next(coordenadas);
        },
        error: (err) => {
          console.error('Error al recuperar las coordenadas:', err);
        },
        complete: () => {
          console.log('Cooredenadas recuperadas.');
        },
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
  
async guardarStore() {
    const viaje = this.viaje$.getValue(); // Obtener datos del viaje
    console.log('Datos preparados para guardar:', viaje);
    this.mensaje = 'Guardando datos...';
    let intentos = 0;
    const maxIntentos = 3;
    this.datosGuardados = false;
    let viajeGuardado: any;

    // Intento guardar el viaje, solo 3 intentos 
    while (!this.datosGuardados && intentos < maxIntentos) {
        try {
            viajeGuardado = await firstValueFrom(this.apiService.createViaje(viaje));

            if (viajeGuardado && viajeGuardado.id_viaje) {
                console.log('Viaje guardado con ID:', viajeGuardado.id_viaje);
                this.datosGuardados = true;
            } else {
                console.warn('No se recibió un ID de viaje en la respuesta.');
            }
        } catch (error) {
            intentos++;
            console.error(`Error al guardar en la API (Intento ${intentos}):`, error);
        }
    }

    // Si guardo el viaje, guardo luego las coordenadas
    if (this.datosGuardados) {
        const coordenadasActualizadas = {
            ...this.coordenadas$.getValue(),
            viaje_id: viajeGuardado.id_viaje //  ID del viaje
        };

        this.subscripciones.add(
            this.apiService.guardarCoordenadas(coordenadasActualizadas).subscribe({
                next: (response) => {
                    console.log("Coordenadas guardadas con ID:", response.id);
                },
                error: (error) => {
                    console.error("Error al guardar coordenadas:", error);
                }
            })
        );

        // Actualizo estado del vehículo
        this.subscripciones.add(
            this.apiService.updateEstadoVehiculo(viaje.id_vehiculo, 1).subscribe({
                next: (response) => {
                    console.log("Estado actualizado correctamente:", response);
                },
                error: (error) => {
                    console.error("Error en la actualización:", error);
                }
            })
        );

        this.cdRef.detectChanges();
        this.mensaje = 'Datos guardados con éxito';
    } else {
        this.mensaje = 'Error: no se pudo guardar los datos tras 3 intentos';
    }

    // Espero antes de navegar a la pantalla principal
    setTimeout(() => {
        this.mensaje = ''; 
        this.router.navigate(['/principal']);
    }, 3000);
}

  ngOnDestroy(){
    this.subscripciones.unsubscribe(); 
  }
}
