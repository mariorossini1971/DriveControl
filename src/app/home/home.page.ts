import { Component, ElementRef, OnInit, OnDestroy, SimpleChange, ViewChild,ChangeDetectorRef,HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GestureController,ToastController} from '@ionic/angular';
import { Usuario } from '../models/usuario.model';
import { MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Location } from '@angular/common';

import { Platform } from '@ionic/angular';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: false
})

export class HomePage implements OnInit, OnDestroy {

  private subscripciones = new Subscription(); 

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
  intervalCuentaAtras: any; // // Controla el intervalo del temporizador cuenta atras
  minuto: number = 0;
  segundo: number = 0;
  hora: number = 0;

  segundosCuentaAtras = 60;   //tiempo para volver a dejar el coche en disponible
  idUsuario: number = 0;
  vehiculos: any[] = [];
  modeloSeleccionado: any;

  modeloSeleccionado$: Subscription = new Subscription();
  idCocheSeleccionado: number = 0;
  idCocheSeleccionado$: Subscription = new Subscription();
  viaje$: Subscription = new Subscription();

  public usuario: Usuario = new Usuario(0,'', '','','',0);

  tiempoFormateado: string = '0 segundos'; // Inicializar el formato

  cocheSelBehaviorSubject$ = new BehaviorSubject<any>({
    id_vehiculo: 0,
    matricula: '',
    marca: '',
    modelo: '',
    ano: '',
    disponible: true,
  });

 
  newItem = {
    final: 'final',
    inicio: 'inicio',
    horaFinal: 'Hfinal',
    horaInicio: 'hInicio',
    cohe: 'moto',
    conductor: 'mario',
  };

  rol : string | null = '';

  direccion: string = '';
  latInicio: number = 0;
  longInicio: number = 0;
  latFinal: number = 0;
  longFinal: number = 0;
  position: any;

  coordenadas = {
    latInicial: 0,
    lngInicial: 0,
    latFinal: 0,
    lngFinal: 0,
  }
  public colorBar: string= '#FFFFFF';
  menuDeshabilitado = false;

  private navigationHistory: string[] = [];

  constructor(
    private gestureCtrl: GestureController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private apiService: ApiService,
    public router: Router,
    private menuCtrl: MenuController,
    private http: HttpClient,
    private platform: Platform,
    private location: Location,
  ) {}

  ngOnInit() {
    this.location.replaceState('/home'); // Borra el historial de navegación en /home
    this.controlRol();
    this.activarMenu();
    this.funcionPrincipal();
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
  }

  ionViewWillEnter(){
    this.controlRol();
    this.controlaTiempo();
  }
  ngAfterViewInit() {
    this.controlaTiempo();
    this.actualizarAncho();//calcula el ancho inicial
    this.createSwipeGesture();
  }


  controlRol(){
    this.subscripciones.add (
      this.apiService.getRol().subscribe(rol => {
        this.rol = rol;
        console.log("Rol actual   * * * ", this.rol);
      })
    );
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
  
  async usuarioGuardado(): Promise<void> {
    try {
      const usuarioGuardado = await Promise.resolve(localStorage.getItem('usuario')); // Simula una operación asíncrona
      if (usuarioGuardado) {
        this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
        this.idUsuario = this.usuario.id_usuario;
        console.log('Usuario recuperado:', this.usuario);

      } else {
        console.warn('Usuario no encontrado.');
      }
    } catch (error) {
      console.warn('Error al recuperar el usuario desde localStorage:', error);
    }
  }
  

  funcionPrincipal(){
    
    this.controlaTiempo();
    this.usuarioGuardado();
    this.subscripciones.add (
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
      })
    );
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
      const tiempo = fecha.toISOString().split('.')[0] + 'Z'; //   // mismo formato que la BBDD
      this.bloqueoPagina = true;
    
      if (this.esInicio) {
          // Si es "INICIO", captura la fecha de inicio

          this.menuCtrl.enable(false); // Desactiva el menú lateral
          this.menuDeshabilitado = true;
          document.querySelector('ion-menu')?.setAttribute('disabled', 'true');

          console.log('es inicio');
          this.fechaHoraInicio = tiempo;
          this.capturoDireccion();
          this.iniciarTemporizador(); // Iniciar el temporizador
          this.cdr.detectChanges(); //Forzar actualización de la vista 
       } else {
          this.menuCtrl.enable(true); // Activa el menú lateral
          this.menuDeshabilitado = false;
          document.querySelector('ion-menu')?.setAttribute('disabled', 'false');

          this.fechaHoraFinal = tiempo;
          this. capturoDireccion();
          this.detenerTemporizador(); // Detener el temporizador
          this.guardarStore();
          this.cambioGuardar();
       }
      // Cambiar el estado del botón de INICIO a FINAL y viceversa
        this.esInicio = !this.esInicio;   
  }

  async guardarStore() {
      this.mostrarGuardar = !this.mostrarGuardar;
      let viaje = {
        id_usuario: this.idUsuario,
        id_vehiculo: this.cocheSelBehaviorSubject$.getValue().id_vehiculo,
        fecha_inicio: this.fechaHoraInicio || 'No definido',
        fecha_fin: this.fechaHoraFinal || 'No definido',
        comentario: 'no hay comentarios',
      };
      console.log('id: ',this.cocheSelBehaviorSubject$.getValue().id_vehiculo);
      this.apiService.setNewItem(viaje);
      this.apiService.setNewCoordenadas(this.coordenadas)
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
    this.fechaHoraInicio = null; // Limpia la hora de inicio
    this.fechaHoraFinal = null; // Limpia la hora de final
    this.minuto = 0; // Reinicia el temporizador
    this.segundo = 0; // Reinicia el temporizador
  }

  cargarDatosVehiculos() {
    this.subscripciones.add (
      this.apiService.getVehiculos().subscribe((data: any[]) => {
        this.vehiculos = data;
      })
    );
  }

  cambiaPagina() {
    if(this.cocheSelBehaviorSubject$.getValue().matricula != ""){
        let id = this.cocheSelBehaviorSubject$.getValue().id_vehiculo;
          // vuelvo a actualizar el vehiculo para dejarlo disponible
          this.subscripciones.add (
            this.apiService.updateEstadoVehiculo(id, 1).subscribe({
              next: (response) => {
                console.log("Estado actualizado correctamente:", response);
              },
              error: (error) => {
                console.error("Error en la actualización:", error);
              }
            })
          );
    }
    this.router.navigate(['/vehiculos'], { queryParams: { origen: 'origen' } });
  }
  
  cambioGuardar(){
    console.log("dentro");
    this.bloqueoPagina = false;
    this.apagoFinal = false;
    this.reiniciarEstado();
    this.router.navigate(['/guardar']);
  }
 
  async capturoDireccion(){

      const options = {
        enableHighAccuracy: true, // Mayor precisión
        timeout: 10000, // Espera más tiempo
        maximumAge: 0 // No usa datos en caché
      };
        this.position = await Geolocation.getCurrentPosition(options);
     // this.position = await Geolocation.getCurrentPosition();
      if(this.esInicio){
        this.coordenadas.latInicial = this.position.coords.latitude;
        this.coordenadas.lngInicial= this.position.coords.longitude;
        this.latInicio = this.position.coords.latitude;
        this.longInicio = this.position.coords.longitude;
        console.log('latidud: ',this.latInicio, ' longitud: ',this.longInicio);
      }else{
        this.coordenadas.latFinal = this.position.coords.latitude;
        this.coordenadas.lngFinal = this.position.coords.longitude;
        this.latFinal = this.position.coords.latitude
        this.longFinal = this.position.coords.longitude;
        console.log('latitud: ',this.latFinal, ' longitud: ',this.longFinal);
      }
    }

    ionViewWillLeave() {        // asegurarme al cambiar pantalla
      if (this.intervalCuentaAtras) {
        clearInterval(this.intervalCuentaAtras);
      }
      this.eliminaVista();
    }
    
    controlaTiempo() {
      console.log("apago final: ", this.apagoFinal);
      this.segundosCuentaAtras = 10; // Reiniciar el contador de tiempo 1 minuto
      if(this.cocheSelBehaviorSubject$.getValue().matricula === "")    // si no hay coche seleccionado no lo inicio
        {
          return
        } 
      this.intervalCuentaAtras = setInterval(() => {
        this.segundosCuentaAtras--;
        console.log(this.segundosCuentaAtras);
        if (this.segundosCuentaAtras <= 0 ) {
           clearInterval(this.intervalCuentaAtras); // Detener el intervalo cuando llegue a 0 y actualizo el vehiculo
          let id = this.cocheSelBehaviorSubject$.getValue().id_vehiculo;
           // vuelvo a actualizar el vehiculo para dejarlo disponible
           this.subscripciones.add (
              this.apiService.updateEstadoVehiculo(id, 1).subscribe({
                next: (response) => {
                  console.log("Estado actualizado correctamente:", response);
                },
                error: (error) => {
                  console.error("Error en la actualización:", error);
                }
              })
           );
          this.eliminaVista();    
          return;        
        }
        if(this.segundo > 0){       // controlo que haya empezado a conducir ???
          clearInterval(this.intervalCuentaAtras); // Detener el intervalo cuando llegue a 0
          return;
        }
      }, 1000); // Disminuye cada segundo
    }
    
    eliminaVista(){
      let coche = {
        id_vehiculo:0,
        matricula : '',
        marca : '',
        modelo : '',
        ano : 0,
        disponible: 0,  
      };
      this.apiService.setCocheSeleccionado(coche);
    }
    ngOnDestroy() {
      this.subscripciones.unsubscribe(); 
      if (this.intervalCuentaAtras) {
        clearInterval(this.intervalCuentaAtras); // Detener el intervalo antes de que el componente se destruya
    }
  }
}
  