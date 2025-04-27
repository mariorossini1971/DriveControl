import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpGestorPageRoutingModule } from './help-gestor-routing.module';

import { HelpGestorPage } from './help-gestor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpGestorPageRoutingModule
  ],
  declarations: [HelpGestorPage]
})
export class HelpGestorPageModule {}
