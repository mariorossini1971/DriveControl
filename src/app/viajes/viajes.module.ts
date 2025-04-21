import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajesComponent } from './viajes.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: ViajesComponent }
];


@NgModule({
  declarations: [ViajesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),  
    IonicModule,
    FormsModule 
  ],
})
export class ViajesModule { }
