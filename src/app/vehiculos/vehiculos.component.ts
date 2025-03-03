import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { RouterLink } from '@angular/router';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})

export class VehiculosComponent implements OnDestroy {
  vehiculos: any[] = [];
  modeloSeleccionado: string = "";

 // modeloSeleccionado$ = Subscription;
  vehiculoSeleccionado: any = null;
  idVehiculo: number = 0;
  //idSeleccionado$ = Subscription;

  constructor(private apiService: ApiService,  public router: Router) { }

   ngOnInit() {
    /*this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.vehiculos = data;
    });*/
  /*  this.apiService.modeloSeleccionado.subscribe(modelo => {
      this.modeloSeleccionado = modelo;
    });*/
    this.cargarDatosVehiculos();
  }

  ngOnChanges(changes: SimpleChanges) {       //para actualizar datos si cambian 
    this.cargarDatosVehiculos();
  }

  cargarDatosVehiculos(){
    this.apiService.getVehiculos().subscribe((data: any[]) => {
     // this.vehiculos = data;
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
  guardarModelo() {     // en realidad solo me sirve el id
        if (this.vehiculoSeleccionado) {
            this.modeloSeleccionado = this.vehiculoSeleccionado.modelo;
            this.idVehiculo = this.vehiculoSeleccionado.id_vehiculo;

            this.apiService.setModeloSeleccionado(this.modeloSeleccionado);
            this.apiService.setIdCoche(this.idVehiculo);
            //this.apiService.modeloSeleccionado = this.modeloSeleccionado;
         //   console.log("Modelo guardado:", this.apiService.modeloSeleccionado);
            console.log("id guardado:", this.apiService.idCoche);
            this.cambiaPagina();

        } else {
            console.log("No hay vehículo seleccionado.");
        }
      }
      cambiaPagina(){
        this.router.navigate(['/home']);
      }
      ngOnDestroy(): void {
          
      }

}
