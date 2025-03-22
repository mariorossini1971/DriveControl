import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { ActivatedRoute, Route, Router } from '@angular/router';


@Component({
  selector: 'app-guardar',
  templateUrl: './guardar.page.html',
  styleUrls: ['./guardar.page.scss'],
})

export class GuardarPage implements OnDestroy{
  viaje$: Subscription = new Subscription();
  mensaje: string = '';
  datosGuardados: boolean = true;
  comentarios: string = '';

  constructor(
        public activateRoute: ActivatedRoute,
        private apiService: ApiService, // Inyecta el servicio API
        public router: Router
  ) { }

  ngOnInit() {
      this.apiService.getNewItem().subscribe((newItem) => {
      console.log('Valor actualizado de newItem en Guardar:', newItem);
    });
  }

/*
  async guardarStore() {

    this.mensaje = 'Guardando Datos';
    let viaje = {
      id_usuario: '',
      id_vehiculo: '',
      fecha_inicio: '',
      fecha_fin: '',
    };
    ////////Borrar
    const newItemActual = this.apiService.getNewItemValue();
    console.log('Valor guardado en el servicio:', newItemActual);

    console.log('Preparado para guardar el viaje ');

    // Guardar en la API

      this.apiService.createViaje(newItemActual).subscribe(
        (response) => {
          console.log('Datos guardados exitosamente en la API');
          this.datosGuardados = true;
        
        },
        (error) => {
          console.error('Error al guardar en la API: ', error);
          
        }
       
      );
    
    
setTimeout(() => {
    this.mensaje = 'Datos guardados con éxito ✅';
    console.log('Datos guardados con éxito ✅');

    setTimeout(() => {
      this.mensaje = ''; // Borra el mensaje después de 2 segundos
    }, 2000); // Desaparece el mensaje después de 2 segundos
  }, 2000); // Muestra "Guardando datos..." por 2 segundos

  }*/

  ngOnDestroy() {

  }



async guardarStore() {
  this.mensaje = 'Guardando Datos';
  let newItemActual = this.apiService.getNewItemValue();
  console.log('Valor guardado en el servicio:', newItemActual);

  console.log('Preparado para guardar el viaje');
  let intentos = 0;      // Contador de intentos
  const maxIntentos = 3; // Número máximo de intentos
  this.datosGuardados = false;

  while (!this.datosGuardados && intentos < maxIntentos) {
    try {
      await this.apiService.createViaje(newItemActual).toPromise(); // Convierte la suscripción en una promesa
      console.log('Datos guardados exitosamente en la API');
      this.datosGuardados = true;
    } catch (error) {
      intentos++;
      console.error(`Error al guardar en la API (Intento ${intentos}): `, error);
    }
  }

  if (this.datosGuardados) {
    this.mensaje = 'Datos guardados con éxito ✅';
    console.log('Datos guardados con éxito ✅');

    setTimeout(() => {
      this.mensaje = ''; // Borra el mensaje después de 2 segundos
    }, 2000);           // Desaparece el mensaje después de 2 segundos
  } else {
    this.mensaje = 'Error: no se pudo guardar los datos tras 3 intentos ❌';
    console.error('Error: no se pudo guardar los datos tras 3 intentos ❌');
  }
  console.log("comentarios: "+this.comentarios);
  setTimeout(() => {
    this.mensaje = ''; 
    this.router.navigate(['/home']);      // Espero un rato para volver a /home
  }, 2000);
  
}

}


