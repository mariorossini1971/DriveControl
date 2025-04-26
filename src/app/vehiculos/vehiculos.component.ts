import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})

export class VehiculosComponent implements OnDestroy {
  vehiculos: any[] = [];
  modeloSeleccionado: string = "";
  disponible: boolean = false;
  mensajeLoading: string =  'cargando datos';
  rol : string | null = '';

  vehiculoSeleccionado: any = null;
  idVehiculo: number = 0;

  cocheDisponible: boolean = true;
  cocheReservado: boolean = true;

  public usuario: Usuario = new Usuario(0,'', '','','',0);
  public usuarioRecuperado: Usuario = new Usuario(0,'','','','',0);
  public rol$ = new BehaviorSubject<string>('');

  mostrar: boolean = true;
  origen: string = '';

  constructor(
    private apiService: ApiService,  
    public router: Router,
    private cdr: ChangeDetectorRef) { }

   ngOnInit() {
    console.log(" ******************************************entro en vehiculos");
    this.controlRol();
    this.controlPagina();
    this.cargarDatosVehiculos();
    this.usuarioGuardado();
    console.log('usuarioGuardado en principal: ', this.usuario.nombre);
  }

  ngAfterViewInit() {
  console.log(" ******************************************entro en vehiculos otra vez");
  this.controlPagina();
  }

  controlRol(){
    this.apiService.cargarRol();
    this.apiService.rol$.subscribe((rol) => {
      this.rol = rol; // Actualiza el valor local
      console.log('Rol actualizado en Vehiculos:', this.rol);
    });
  }

  controlPagina() {
    try {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras?.state;
  
      console.log("antes de entrar en state");
      if (state && state['origen']) {
        this.origen = state['origen'];
        console.log("Origen recibido:", this.origen);
        if(this.origen === 'dashboard'){
          this.mostrar = false; 
          this.cdr.detectChanges(); // Forzar la actualización
        } else { 
          this.mostrar = true;
          this.cdr.detectChanges(); // Forzar la actualización
          };
      } else {
        console.log("No se recibió el estado esperado.");
        this.mostrar = true;
        this.cdr.detectChanges(); // Forzar la actualización

      }
    } catch (error) {
      console.error("Error en controlPagina:", error);
    }
    console.log("-------------------Muestro :", this.mostrar);
  }
   
  cargarDatosVehiculos(){
    this.apiService.loading(this.mensajeLoading);
    this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.apiService.LoadingController.dismiss();
      this.vehiculos = data.filter(vehiculo => vehiculo.disponible == true);   //filtro solo los disponibles
      console.log(data);
    });
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

            this.modeloSeleccionado = this.vehiculoSeleccionado.modelo;
            this.idVehiculo = this.vehiculoSeleccionado.id_vehiculo;

            this.apiService.setModeloSeleccionado(this.modeloSeleccionado);
            this.apiService.setIdCoche(this.idVehiculo);

            this.apiService.setCocheSeleccionado(coche);     //////////////////////
            
            console.log("id guardado:", this.apiService.idCoche);
            this.cambiaPagina();

        } else {
            console.log("No hay vehículo seleccionado.");
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
        console.warn('Usuario no encontrado.');
      }
      }

  

      ngOnDestroy(): void {
          
      }

}
