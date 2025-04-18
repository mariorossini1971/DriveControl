import { Component, ElementRef, OnInit, OnDestroy, SimpleChange, ViewChild,ChangeDetectorRef,HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiService } from '../api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GestureController,ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy {

  @ViewChild('swipeButton',{read: ElementRef }) swipeButton!: ElementRef;
  color = 'primary';
  text = 'Swipe';

  swipeInProgress = false;
  colWidth!: number;
  translateX!: number;

  swipeGesture!: any;

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

 // mensaje: string = '';

  vehiculos: any[] = [];
  modeloSeleccionado: any;



  modeloSeleccionado$: Subscription = new Subscription();
  idCocheSeleccionado: number = 0;
  idCocheSeleccionado$: Subscription = new Subscription();
  viaje$: Subscription = new Subscription();

  tiempoFormateado: string = '0 segundos'; // Inicializar el formato

  cocheSelBehaviorSubject$ = new BehaviorSubject<any>({
    id_vehiculo: 0,
    matricula: '',
    marca: '',
    modelo: '',
    ano: '',
    disponible: true,
  });




 
  //toDoList: any[] = [];
  newItem = {
    final: 'final',
    inicio: 'inicio',
    horaFinal: 'Hfinal',
    horaInicio: 'hInicio',
    cohe: 'moto',
    conductor: 'mario',
  };

  constructor(
    private gestureCtrl: GestureController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit() {
    /*
    this.apiService.getModeloSeleccionado().subscribe({
      next: (cocheSelBehaviorSubject) => {
        console.log('Model2 seleccionado:', cocheSelBehaviorSubject);
        //this.cocheSelBehaviorSubject.next(modeloSeleccionado); // Actualizamos el BehaviorSubject
      },
      error: (err) => {
        console.error('Error al recuperar modelo seleccionado:', err);
      },
      complete: () => {
        console.log('Suscripción completada.');
        console.log('matricula: ', this.cocheSelBehaviorSubject$.getValue().id_Vehiculo)
      },
    });*/

///////////////////////////////////
    this.apiService.getCocheSeleccionado().subscribe({
      next: (coche) => {
        this.cocheSelBehaviorSubject$.next(coche);
        console.log('matricula', this.cocheSelBehaviorSubject$.getValue().matricula);
        this.apagoFinal = this.cocheSelBehaviorSubject$.getValue().matricula === "";
            },
      error: (err) => {
        console.error('Error al recuperar modelo seleccionado:', err);
      },
      complete: () => {
        console.log('Suscripción completada.');
      },
    });
  //////////////////////////////////////////////////
  //  const cocheSeleccionado = this.cocheSelBehaviorSubject$.getValue();
  //  console.log('Matrícula del coche seleccionado:', cocheSeleccionado.matricula);
/*
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
    });*/
  }

  ngAfterViewInit() {
    this.actualizarAncho();//calcula el ancho inicial
    this.createSwipeGesture();
  }

  private createSwipeGesture(){
    this.swipeGesture = this.gestureCtrl.create({
      el: this.swipeButton.nativeElement,
      threshold:10,
      gestureName: 'swipe',
      onStart: () => {
        //manejar el inicio del gesto del deslizamiento si es necesario
        this.swipeInProgress = true;
        //actualizar ancho para responsive
        this.actualizarAncho();
      },
      onMove: (detail) => {
        if (this.swipeInProgress && detail.deltaX > 0){
          const deltaX = detail.deltaX;
          console.log('deltax: ',deltaX);
          const colWidth = this.swipeButton.nativeElement.parentElement.clientWidth;
          this.colWidth = colWidth - (15 / 100 * colWidth);
          console.log('colWidth: ',this.colWidth);
          this.translateX = Math.min(deltaX, this.colWidth);
          console.log('translatex: ', this.translateX);
          this.swipeButton.nativeElement.style.transform = `translateX(${this.translateX}px)`;
        }
      },
      onEnd:  (detail) => {
        if(this.translateX >= this.colWidth){
          console.log('swiped');
          this.capturarFechaHora();
        }
        this.swipeInProgress = false;
        this.swipeButton.nativeElement.style.transform = 'translateX(0)';
      },
    });
    this.swipeGesture.enable(true);
  }

  delay(ms: number){
    return new Promise (resolve => setTimeout(resolve, ms));
  }

  private actualizarAncho(){
    //Ancho del botón responsive
    const boton = this.swipeButton.nativeElement.closest('ion-col') || this.swipeButton.nativeElement.parentElement;
    this.colWidth = boton.clientWidth;
    console.log('Ancho del swipe: ',this.colWidth);
  }
  @HostListener('window:resize', ['$event'])
  onResize(){
    this.actualizarAncho();  //recalcula el ancho al cambiar de tamaño u orientación
  }

  capturarFechaHora() {

    const fecha = new Date();
    const tiempo = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().split('.')[0] + 'Z';  // mismo formato que la BBDD
    this.bloqueoPagina = true;
  
    if (this.esInicio) {
      // Si es "INICIO", captura la fecha de inicio
      console.log('es inicio')
      this.fechaHoraInicio = tiempo;
      this.iniciarTemporizador(); // Iniciar el temporizador
      this.cdr.detectChanges(); //Forzar actualización de la vista 
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
      id_vehiculo: this.cocheSelBehaviorSubject$.getValue().id_vehiculo,
      fecha_inicio: this.fechaHoraInicio || 'No definido',
      fecha_fin: this.fechaHoraFinal || 'No definido',
      comentario: 'no hay comentarios',
    };
    console.log('id: ',this.cocheSelBehaviorSubject$.getValue().id_vehiculo);
    this.apiService.setNewItem(viaje);
  }

  iniciarTemporizador() {
    this.segundo = 0; // Reiniciar el contador de tiempo
    this.interval = setInterval(() => {
      this.segundo++;
      console.log(this.segundo);
      if (this.segundo == 60) {
        this.minuto++;
        this.segundo = 0;
      }
      this.cdr.detectChanges(); //Forzar el cambio en la vista cada segundo
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
    console.log("dentro");
    this.bloqueoPagina = false;
    this.apagoFinal = false;
    this.reiniciarEstado();
    this.router.navigate(['/guardar']);
  }
  
  ngOnDestroy() {
    this.modeloSeleccionado$.unsubscribe();
    this.viaje$.unsubscribe();
  }
}
