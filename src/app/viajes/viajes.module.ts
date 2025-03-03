import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajesComponent } from './viajes.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';


const routes: Routes = [
  { path: '', component: ViajesComponent }
];


@NgModule({
  declarations: [ViajesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),  
    IonicModule   
  ],
})
export class ViajesModule { }
