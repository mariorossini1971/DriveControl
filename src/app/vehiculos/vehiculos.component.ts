import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ApiService } from '../api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertController, MenuController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Component({
    selector: 'app-vehiculos',
    templateUrl: './vehiculos.component.html',
    styleUrls: ['./vehiculos.component.scss'],
    standalone: false
})

export class VehiculosComponent implements OnDestroy {

  private subscripciones = new Subscription(); 
  vehiculos: any[] = [];
  disponible: boolean = false;
  mensajeLoading: string =  'cargando datos';
  rol : string | null = '';

  vehiculoSeleccionado: any = null;
  idVehiculo: number = 0;

  public usuario: Usuario = new Usuario(0,'', '','','',0);
  mostrar: boolean = true;
  origen: string = '';
  filtroTexto: string = '';
  ordenDireccion: 'asc' | 'desc' = 'asc';  // A-Z o Z-A



  colorBar: string = '#FFFFFF';

  constructor(
    private apiService: ApiService,  
    public router: Router,
    private cdr: ChangeDetectorRef,
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    
  ) { }

   ngOnInit() {
    this.controlRol();
    this.controlPagina();
    this.activarMenu();
    this.usuarioGuardado();
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
  }

  ionViewWillEnter(){
    this.controlPagina();
    this.cargarDatosVehiculos();
    this.cdr.detectChanges();
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


  controlPagina() {
    try {
      this.subscripciones.add (
        this.route.queryParams.subscribe(params => {
          if (params['origen']) {
            this.origen = params['origen'];
            if (this.origen === 'dashboard') {
              this.mostrar = false;
            } else {
              this.mostrar = true;
            }
            this.cdr.detectChanges(); // Forzar actualización
          } else {
            console.log("No se recibió el estado esperado.");
            this.mostrar = true;
            this.cdr.detectChanges(); // Forzar actualización
          }
        })
    );
    } catch (error) {
      console.error("Error en controlPagina:", error);
    }
  }
       
  cargarDatosVehiculos(){
    this.apiService.loading(this.mensajeLoading);
    this.subscripciones.add (
      this.apiService.getVehiculos().subscribe((data: any[]) => {
        this.apiService.LoadingController.dismiss();
        if (this.origen !== 'dashboard'){
          data = data.filter(vehiculo => vehiculo.disponible == true);   //filtro solo los disponibles
        }
        this.vehiculos = data;
        console.log(data);
      })
    );
    this.cdr.detectChanges(); // Forzar la actualización
  }

  seleccionarVehiculo(vehiculo:any){
      if (this.vehiculoSeleccionado === vehiculo) {
        this.vehiculoSeleccionado = null; // Desmarca si ya está seleccionado
      } else {
        this.vehiculoSeleccionado = vehiculo; // Marca el nuevo
    }

  }
  guardarModelo() {   

        let coche = {
          id_vehiculo: this.vehiculoSeleccionado.id_vehiculo,
          matricula : this.vehiculoSeleccionado.matricula,
          marca : this.vehiculoSeleccionado.marca,
          modelo : this.vehiculoSeleccionado.modelo,
          ano : this.vehiculoSeleccionado.ano,
          disponible: this.disponible   
        };
        if (this.vehiculoSeleccionado) {
            this.idVehiculo = coche.id_vehiculo;
            this.apiService.setIdCoche(this.idVehiculo);   // guardo el id del vehiculo
            this.apiService.setCocheSeleccionado(coche);     // guardo el coche seleccionado             
            this.subscripciones.add (
              this.apiService.updateEstadoVehiculo(this.idVehiculo, 0).subscribe({
                next: (response) => {
                  console.log("Estado actualizado correctamente:", response);
                },
                error: (error) => {
                  console.error("Error en la actualización:", error);
                  this.presentAlert('Error', 'Error en la actualización:');
                }
              })
           );
          this.cambiaPagina();

        } else {
            this.presentAlert('Error', 'o hay vehículo seleccionado.');
        }
      }
  cambiaPagina(){
    this.router.navigate(['/home']);
  }
      
  verVehiculo(vehiculo: any){
    if(this.rol === 'conductor'){
      this.router.navigate(['/vehiculo-detalle'],{ state: {vehiculo, modo: 'ver' } }); 
    } else{
        this.router.navigate(['/vehiculo-detalle'],{ state: {vehiculo, modo: 'verEditor' } });
      }       
  }

  nuevoVehiculo(){
    this.router.navigate(['/vehiculo-detalle'], { state: { modo: 'crear' } });
  }

  usuarioGuardado(){
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
    } else {
      this.presentAlert('Error', 'Usuario no encontrado');
    }
  }
  get vehiculosFiltradosYOrdenados() {
      return this.vehiculos
        .filter(vehiculos => {
          const texto = this.filtroTexto.toLowerCase();
          return (
          
            vehiculos.marca.toLowerCase().includes(texto) ||
            vehiculos.modelo.toLowerCase().includes(texto) ||
            vehiculos.matricula.toLowerCase().includes(texto)
          );
        })
        .sort((a, b) => {
          const valA = a.marca.toLowerCase();
          const valB = b.marca.toLowerCase();
          
          if (this.ordenDireccion === 'asc') {
            return valA.localeCompare(valB); // Orden ascendente
          } else {
            return valB.localeCompare(valA); // Orden descendente
          }
        });
  }
  
  async presentAlert (titulo:string, mensaje:string){
    const alert = await this.alertController.create({
      header:titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  ngOnDestroy() {
    this.subscripciones.unsubscribe(); 
  }

}
