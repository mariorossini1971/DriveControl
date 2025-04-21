import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeDetallePageRoutingModule } from './viaje-detalle-routing.module';

import { ViajeDetallePage } from './viaje-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeDetallePageRoutingModule
  ],
  declarations: [ViajeDetallePage]
})
export class ViajeDetallePageModule {}
