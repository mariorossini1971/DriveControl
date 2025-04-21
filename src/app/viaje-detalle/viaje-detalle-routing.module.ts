import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeDetallePage } from './viaje-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeDetallePageRoutingModule {}
