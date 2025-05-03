import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Component({
    selector: 'app-guardar',
    templateUrl: './guardar.page.html',
    styleUrls: ['./guardar.page.scss'],
    standalone: false
})

export class GuardarPage implements OnDestroy{
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

  rol: string = "";

   public usuario: Usuario = new Usuario(0,'', '','','',0);
   public usuarioRecuperado: Usuario = new Usuario(0,'','','','',0);


  mensaje: string = '';
  datosGuardados: boolean = true;

  constructor(
        public activateRoute: ActivatedRoute,
        private apiService: ApiService, // Inyecta el servicio API
        public router: Router,
        private cdRef: ChangeDetectorRef // Inyectamos ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);

    this.apiService.getNewItem().subscribe({
      next: (viaje) => {
        console.log('viaje seleccionado:', viaje);

        // Si no hay comentario, valo predeterminado
   if (!viaje.comentario || viaje.comentario.trim() === '') {
    viaje.comentario = '';
   }

    // Verificamos si el comentario contiene 'no hay comentarios' y lo reemplazamos por vacío
    if (viaje.comentario === 'no hay comentarios') {
      viaje.comentario = ''; // Lo dejamos vacío para que se vea el placeholder
    }

        this.viaje$.next(viaje);
        console.log('comentario', this.viaje$.getValue().comentario)
      },
      error: (err) => {
        console.error('Error al recuperar modelo seleccionado:', err);
      },
      complete: () => {
        console.log('Suscripción completada.');
      },
    });
    this.apiService.getNewCoordenadas().subscribe({
      next: (coordenadas) => {
        console.log('coordenadas seleccionadas:', coordenadas);
        this.coordenadas$.next(coordenadas);
      },
      error: (err) => {
        console.error('Error al recuperar modelo seleccionado:', err);
      },
      complete: () => {
        console.log('Suscripción completada.');
      },
    });

  }

  ngOnDestroy() {}

  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
  } else {
    console.warn('Usuario no encontrado.');
  }
  }
  

async guardarStore() {

    this.mensaje = '';
    const viaje = this.viaje$.getValue(); // Extrae el objeto viaje
    console.log('Datos preparados para guardar:', viaje);

      // Si no hay comentario, lo rellenamos
      if (!viaje.comentario || viaje.comentario.trim() === '') {
        viaje.comentario = 'gaurdarStore: no message';
      }

      this.mensaje = 'Guardando datos...';
      console.log('2Guardando datos...', this.mensaje);

    let intentos = 0; // Contador de intentos
    const maxIntentos = 3; // Máximo número de intentos
    this.datosGuardados = false;

    while (!this.datosGuardados && intentos < maxIntentos) {
      try {
        const response = await firstValueFrom(this.apiService.createViaje(viaje));    
    
        if (response && response.id_viaje) {
          console.log('Viaje guardado con ID:', response.id_viaje);
          this.datosGuardados = true;

                // Guardar el ID en el BehaviorSubject
          this.coordenadas$.next({
            ...this.coordenadas$.getValue(), // Mantiene los valores anteriores
            viaje_id: response.id_viaje, // Asigna el nuevo ID
          });
          console.log('ID del viaje:', this.coordenadas$.getValue().viaje_id);
          

        } else {
          console.warn('No se recibió un ID de viaje en la respuesta.');
        } 
      } catch (error) {
        intentos++;
        console.error(`Error al guardar en la API (Intento ${intentos}):`, error);
      }
      let coord = this.coordenadas$.getValue();
      console.log('datos de coordenadas: ',this.coordenadas$.getValue());
      console.log('ide del vehiculo: ', viaje.id_Vehiculo);

      this.apiService.guardarCoordenadas(coord).subscribe({
        next: (response) => {
          console.log("Coordenadas guardadas con ID:", response.id);
        },
        error: (error) => {
          console.error("Error al guardar coordenadas:", error);
        }
      }); // guardo coordenadas en la BBDD

    }
    //actualizo estado del vehiculo
       this.apiService.updateEstadoVehiculo(viaje.id_vehiculo, 1).subscribe({
         next: (response) => {
           console.log("Estado actualizado correctamente:", response);
        },
        error: (error) => {
          console.error("Error en la actualización:", error);
         }
      });
    // Usamos ChangeDetectorRef para asegurarnos de que Angular actualice la vista
    this.cdRef.detectChanges();

    if (this.datosGuardados) {
      this.mensaje = 'Datos guardados con éxito ✅';
      console.log(this.mensaje);
    } else {
      this.mensaje = 'Error: no se pudo guardar los datos tras 3 intentos ❌';
      console.error(this.mensaje);
    }

    // Redirigir después de un tiempo
    setTimeout(() => {
      this.mensaje = ''; 
      this.router.navigate(['/principal']);
    }, 3000);
  }

}
