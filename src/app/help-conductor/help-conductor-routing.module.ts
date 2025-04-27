import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpConductorPage } from './help-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: HelpConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpConductorPageRoutingModule {}
