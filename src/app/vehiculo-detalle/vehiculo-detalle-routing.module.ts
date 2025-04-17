import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehiculoDetallePage } from './vehiculo-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: VehiculoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiculoDetallePageRoutingModule {}
