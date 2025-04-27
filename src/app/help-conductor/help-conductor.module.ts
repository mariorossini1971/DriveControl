import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpConductorPageRoutingModule } from './help-conductor-routing.module';

import { HelpConductorPage } from './help-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpConductorPageRoutingModule
  ],
  declarations: [HelpConductorPage]
})
export class HelpConductorPageModule {}
