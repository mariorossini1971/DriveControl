import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss'],
})
export class ViajesComponent  implements OnInit {
  viajes: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getViajes().subscribe((data: any[]) => {
      this.viajes = data;
    });
  }

}
