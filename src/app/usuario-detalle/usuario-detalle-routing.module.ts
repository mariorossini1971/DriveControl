import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioDetallePage } from './usuario-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: UsuarioDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioDetallePageRoutingModule {}
