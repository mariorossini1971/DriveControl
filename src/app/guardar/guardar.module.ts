import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuardarPageRoutingModule } from './guardar-routing.module';

import { GuardarPage } from './guardar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardarPageRoutingModule
  ],
  declarations: [GuardarPage]
})
export class GuardarPageModule {}
