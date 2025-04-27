import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpGestorPage } from './help-gestor.page';

const routes: Routes = [
  {
    path: '',
    component: HelpGestorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpGestorPageRoutingModule {}
