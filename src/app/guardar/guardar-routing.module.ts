import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardarPage } from './guardar.page';

const routes: Routes = [
  {
    path: '',
    component: GuardarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuardarPageRoutingModule {}
