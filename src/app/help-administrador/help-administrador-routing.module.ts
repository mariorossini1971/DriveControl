import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpAdministradorPage } from './help-administrador.page';

const routes: Routes = [
  {
    path: '',
    component: HelpAdministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpAdministradorPageRoutingModule {}
