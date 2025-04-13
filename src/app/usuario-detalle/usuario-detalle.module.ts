import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuarioDetallePageRoutingModule } from './usuario-detalle-routing.module';

import { UsuarioDetallePage } from './usuario-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuarioDetallePageRoutingModule
  ],
  declarations: [UsuarioDetallePage]
})
export class UsuarioDetallePageModule {}
