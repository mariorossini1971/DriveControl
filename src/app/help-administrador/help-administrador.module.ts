import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // <<-- Importante
import { HelpAdministradorPageRoutingModule } from './help-administrador-routing.module';

import { HelpAdministradorPage } from './help-administrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // <<-- Este módulo hace que reconozca <ion-...>
    HelpAdministradorPageRoutingModule
  ],
  declarations: [HelpAdministradorPage]
})
export class HelpAdministradorPageModule {}