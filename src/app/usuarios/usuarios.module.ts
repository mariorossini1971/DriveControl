import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {ApiService} from '../api.service';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', 
    component: UsuariosComponent }
];

@NgModule({
  declarations: [UsuariosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    FormsModule

  ],
  providers:[ApiService],
})
export class UsuariosModule { }
