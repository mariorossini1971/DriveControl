import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { ActivatedRoute, Route, Router } from '@angular/router';


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



  mensaje: string = '';
  datosGuardados: boolean = true;

  constructor(
        public activateRoute: ActivatedRoute,
        private apiService: ApiService, // Inyecta el servicio API
        public router: Router
  ) { }

  ngOnInit() {

    this.apiService.getNewItem().subscribe({
      next: (viaje) => {
        console.log('viaje seleccionado:', viaje);
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
  

async guardarStore() {
    this.mensaje = 'Guardando Datos';
    const viaje = this.viaje$.getValue(); // Extrae el objeto viaje
    console.log('Datos preparados para guardar:', viaje);

    let intentos = 0; // Contador de intentos
    const maxIntentos = 3; // Máximo número de intentos
    this.datosGuardados = false;

    while (!this.datosGuardados && intentos < maxIntentos) {
      try {
        // Enviar datos a la API y esperar el resultado
        const response = await this.apiService.createViaje(viaje).toPromise();
        console.log('Datos guardados exitosamente:', response);
        this.datosGuardados = true;
      } catch (error) {
        intentos++;
        console.error(`Error al guardar en la API (Intento ${intentos}):`, error);
      }
    }

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
      this.router.navigate(['/home']);
    }, 2000);
  }

}


