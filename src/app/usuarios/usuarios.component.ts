import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuario ={
    nombre: 'Mario',
    correo: '233',
  };

  constructor(
    private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getUsuarios().subscribe((data: any[]) => {
      this.usuarios = data;
    });
  }
}

