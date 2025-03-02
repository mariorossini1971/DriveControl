import { Component, OnDestroy, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  fechaHoraInicio: string | null = null;
  fechaHoraFinal: string | null = null;
  esInicio: boolean = true;
  mostrarGuardar: boolean = false;
  tiempoTranscurrido: number = 0; // Guardar el tiempo transcurrido en segundos
  interval: any; // Controla el intervalo del temporizador
  minuto: number = 0;
  segundo: number = 0;
  hora: number = 0;

  mensaje: string = ' ';

  vehiculos: any[] = [];
  modeloSeleccionado: any;



  modeloSeleccionado$: Subscription = new Subscription();
  idCocheSeleccionado: number = 0;
  idCocheSeleccionado$: Subscription = new Subscription();

  tiempoFormateado: string = '0 segundos'; // Inicializar el formato

  documentCount: number = 0; // Variable para contar los documentos
  toDoList: any[] = [];
  newItem = {
    final: 'final',
    inicio: 'inicio',
    horaFinal: 'Hfinal',
    horaInicio: 'hInicio',
    cohe: 'moto',
    conductor: 'mario',
  };

  constructor(
    public activateRoute: ActivatedRoute,
    public firestore: AngularFirestore,
    private apiService: ApiService, // Inyecta el servicio API
    public router: Router
  ) {
    this.modeloSeleccionado$ = this.apiService.getModeloSeleccionado().subscribe({
      next: (modeloSeleccionado) => {
        this.modeloSeleccionado = modeloSeleccionado;
        console.log('dato que llega desde el servicio:', this.modeloSeleccionado);
      },
      error: (error: any) => {
        this.modeloSeleccionado = '';
        console.log('error al recuperar datos', error);
      },
    });
    this.idCocheSeleccionado$ = this.apiService.getIdCoche().subscribe({
      next: (idCoche) => {
        this.idCocheSeleccionado = idCoche;
        console.log('dato que llega desde el servicio ID:', this.idCocheSeleccionado);
      },
      error: (error: any) => {
        this.idCocheSeleccionado = 0;
        console.log('error al recuperar datos', error);
      },
    });

  }

  ngOnInit() {

    console.log('primero miro el coche: ' + this.modeloSeleccionado);
    this.cargarDatosVehiculos();
  }

  ngOnChanges(changes: SimpleChange) {
    // para actualizar datos si cambian
    this.cargarDatosVehiculos();
  }

  capturarFechaHora() {

    const fecha = new Date();
    const tiempo = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().split('.')[0] + 'Z';  // mismo formato que la BBDD
   

  
  if (this.esInicio) {
      // Si es "INICIO", captura la fecha de inicio
      this.fechaHoraInicio = tiempo;
      this.iniciarTemporizador(); // Iniciar el temporizador
    } else {
      // Si es "FINAL", captura la fecha de final
      this.fechaHoraFinal = tiempo;
      this.detenerTemporizador(); // Detener el temporizador
      this.mostrarGuardar = true;
    }
    // Cambiar el estado del botón de INICIO a FINAL y viceversa
    this.esInicio = !this.esInicio;
  }

  async guardarStore() {
    /*
    if (!this.fechaHoraInicio || !this.fechaHoraFinal) {
      console.error('Error: no se pueden guardar los datos sin un inicio y un final definidos.');
      return;
    }
    */

    this.mensaje = 'Guardando Datos';
    this.mostrarGuardar = !this.mostrarGuardar;

    let viaje = {
      id_usuario: 3,
      id_vehiculo: this.idCocheSeleccionado,
      fecha_inicio: this.fechaHoraInicio || 'No definido',
      fecha_fin: this.fechaHoraFinal || 'No definido',
    };

    console.log('Preparado para guardar el viaje ');

    // Guardar en la API
    this.apiService.createViaje(viaje).subscribe(
      (response) => {
        console.log('Datos guardados exitosamente en la API');
        this.reiniciarEstado();
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
        this.mostrarGuardar = false; // Vuelve a mostrar el botón INICIO
        this.esInicio = true; // Reinicia el estado para INICIO
      }, 2000); // Desaparece el mensaje después de 2 segundos
    }, 2000); // Muestra "Guardando datos..." por 2 segundos
  }

  iniciarTemporizador() {
    this.segundo = 0; // Reiniciar el contador de tiempo
    this.interval = setInterval(() => {
      this.segundo++;
      if (this.segundo == 60) {
        this.minuto++;
        this.segundo = 0;
      }
    }, 1000); // Aumenta el tiempo cada segundo
  }

  detenerTemporizador() {
    clearInterval(this.interval); // Detener el intervalo
  }

  reiniciarEstado() {
    // this.esInicio = true; // Vuelve a mostrar INICIO
    this.fechaHoraInicio = null; // Limpia la hora de inicio
    this.fechaHoraFinal = null; // Limpia la hora de final
    this.minuto = 0; // Reinicia el temporizador
    this.segundo = 0; // Reinicia el temporizador
  }

  cargarDatosVehiculos() {
    this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.vehiculos = data;
    });
  }

  cambiaPagina() {
    this.router.navigate(['/vehiculos']);
  }

  ngOnDestroy() {
    this.modeloSeleccionado$.unsubscribe();
  }
}
