import { Component, OnDestroy, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import Swiper from 'swiper';

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
  bloqueoPagina: boolean = false;
  apagoFinal: boolean = false;
  
  tiempoTranscurrido: number = 0; // Guardar el tiempo transcurrido en segundos
  interval: any; // Controla el intervalo del temporizador
  minuto: number = 0;
  segundo: number = 0;
  hora: number = 0;

  mensaje: string = '';

  vehiculos: any[] = [];
  modeloSeleccionado: any;



  modeloSeleccionado$: Subscription = new Subscription();
  idCocheSeleccionado: number = 0;
  idCocheSeleccionado$: Subscription = new Subscription();
  viaje$: Subscription = new Subscription();

  cocheSelBehaviorSubject = new BehaviorSubject<any>({
    matricula: 0,
    marca: 0,
    modelo: 0,
    ano: 0,
    disponible: true,
  });



  tiempoFormateado: string = '0 segundos'; // Inicializar el formato
  onSwiper(swiper: Swiper) {
    console.log(swiper); // Para depuración
  };
 
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
  ) {}


  ngOnInit() {
    
    this.apiService.getModeloSeleccionado().subscribe({
      next: (modeloSeleccionado) => {
        console.log('Modeloooo seleccionado:', modeloSeleccionado);
        this.cocheSelBehaviorSubject.next(modeloSeleccionado); // Actualizamos el BehaviorSubject
      },
      error: (err) => {
        console.error('Error al recuperar el modelo seleccionado:', err);
      },
      complete: () => {
        console.log('Suscripción completada.');
      },
    });
  
    const cocheSeleccionado = this.cocheSelBehaviorSubject.getValue();
    console.log('Matrícula del coche seleccionado:', cocheSeleccionado.matricula);

    this.modeloSeleccionado$ = this.apiService.getModeloSeleccionado().subscribe({
      next: (modeloSeleccionado) => {
        this.modeloSeleccionado = modeloSeleccionado;
        console.log('Dato que llega desde el servicio (modeloSeleccionado):', this.modeloSeleccionado);
        
        this.apagoFinal = this.modeloSeleccionado === "";  // si no hay coche no dejo iniciar viaje
        console.log("Valor de apagoFinal: " + this.apagoFinal);
      },
      error: (error: any) => {
        this.modeloSeleccionado = '';
        console.log('Error al recuperar datos de modeloSeleccionado', error);
      },
    });

    this.idCocheSeleccionado$ = this.apiService.getIdCoche().subscribe({
      next: (idCoche) => {
        this.idCocheSeleccionado = idCoche;
        console.log('Dato que llega desde el servicio (idCocheSeleccionado):', this.idCocheSeleccionado);
      },
      error: (error: any) => {
        this.idCocheSeleccionado = 0;
        console.log('Error al recuperar datos de idCocheSeleccionado', error);
      },
    });
  }

  capturarFechaHora() {

    const fecha = new Date();
    const tiempo = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().split('.')[0] + 'Z';  // mismo formato que la BBDD
    this.bloqueoPagina = true;

  
    if (this.esInicio) {
      // Si es "INICIO", captura la fecha de inicio
      
      this.fechaHoraInicio = tiempo;
      this.iniciarTemporizador(); // Iniciar el temporizador
    } else {
      //this.bloqueoPagina = false;
      // Si es "FINAL", captura la fecha de final
      this.fechaHoraFinal = tiempo;
      this.detenerTemporizador(); // Detener el temporizador
      // this.mostrarGuardar = true;
      this.guardarStore();
      this.cambioGuardar();
    }
    // Cambiar el estado del botón de INICIO a FINAL y viceversa
    this.esInicio = !this.esInicio;
  }

  async guardarStore() {

    this.mostrarGuardar = !this.mostrarGuardar;
    let viaje = {
      id_usuario: 3,
      id_vehiculo: this.idCocheSeleccionado,
      fecha_inicio: this.fechaHoraInicio || 'No definido',
      fecha_fin: this.fechaHoraFinal || 'No definido',
    };
    this.apiService.setNewItem(viaje);
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
    this.apagoFinal = true;
    
  }

  async reiniciarEstado() {
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
  cambioGuardar(){

    this.bloqueoPagina = false;
    this.apagoFinal = false;
    this.reiniciarEstado();
    this.router.navigate(['/guardar']);
  }
  onSlideComplete() {
    console.log('¡Acción ejecutada!');
    this.cambiaPagina();
  }
  
  ngOnDestroy() {
    this.modeloSeleccionado$.unsubscribe();
    this.viaje$.unsubscribe();
  }
}
