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
  disponible: boolean = false;
  mensajeLoading: string =  'cargando datos';

 // modeloSeleccionado$ = Subscription;
  vehiculoSeleccionado: any = null;
  idVehiculo: number = 0;
  //idSeleccionado$ = Subscription;
  cocheDisponible: boolean = true;
  cocheReservado: boolean = true;


  constructor(
    private apiService: ApiService,  
    public router: Router) { }

   ngOnInit() {

    this.cargarDatosVehiculos();
  }

  cargarDatosVehiculos(){
    this.apiService.loading(this.mensajeLoading);
    this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.apiService.LoadingController.dismiss();
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

        let coche = {
          id_vehiculo: this.vehiculoSeleccionado.id_Vehiculo,
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
          /*   this.apiService.setCocheSelec(this.idVehiculo, coche).subscribe(
              response => {
                console.log('Vehículo actualizado', response);
              },
              error => {
                console.error('Error al actualizar el vehículo:', error);
              }
              } */     // activalo luego   es para bloquear el coche   es para bloquear el coche 

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
