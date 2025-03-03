import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss'],
})
export class ViajesComponent implements OnInit {
  viajes: any[] = [];
  control: number = 0;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {

    this.loadViajes();

    /***Para comtrolar que vuelvo a la pagina y volver a cargar la lista*/
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("ha entrado otra vez");
        this.loadViajes();
      }
    });
  }

  loadViajes() {
    console.log("control =", this.control);
    if (this.control === 0) {
      this.apiService.getViajes().subscribe((data: any[]) => {
        this.viajes = data.sort((a, b) => a.id_viaje - b.id_viaje);  //los ordeno por id_viaje si no los muestra como llegan
      });
    }
  }
}
