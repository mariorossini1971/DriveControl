import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { RouterLink } from '@angular/router';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  modeloSeleccionado: string = "uno";
  vehiculoSeleccionado: any = null;
  idVehiculo: number = 0;

  constructor(private apiService: ApiService,  public router: Router) { }

   ngOnInit() {
    /*this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.vehiculos = data;
    });*/
    this.cargarDatosVehiculos();
  }
  cargarDatosVehiculos(){
    this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.vehiculos = data;
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
        if (this.vehiculoSeleccionado) {
            this.modeloSeleccionado = this.vehiculoSeleccionado.modelo;
            this.idVehiculo = this.vehiculoSeleccionado.id_vehiculo;
            this.apiService.idCoche = this.idVehiculo;
            console.log("Modelo guardado:", this.modeloSeleccionado);
            console.log("id guardado:", this.idVehiculo);
            this.apiService.idCoche = this.idVehiculo;
            this.router.navigate(['/home/']);
        } else {
            console.log("No hay vehículo seleccionado.");
        }
      }

}
