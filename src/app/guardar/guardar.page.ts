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
})

export class GuardarPage implements OnDestroy{

  viaje$ = new BehaviorSubject<any>({
    id_viaje: 0,
    id_usuario: '',
    id_vehiculo: '',
    fecha_inicio: '',
    fecha_fin: '',
    comentario: '',
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
        // Enviar datos a la API y esperar el resultado
        const response = await firstValueFrom(this.apiService.createViaje(viaje));        console.log('Datos guardados:', response);
        this.datosGuardados = true;
      } catch (error) {
        intentos++;
        console.error(`Error al guardar en la API (Intento ${intentos}):`, error);
      }
    }
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


