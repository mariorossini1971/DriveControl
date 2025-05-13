import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment} from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor.interceptor';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';


registerLocaleData(localeEs);


@NgModule({
  declarations: [AppComponent],
  imports: [
  HttpClientModule,
  BrowserModule, 
  IonicModule.forRoot(), 
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,  
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    { provide: LOCALE_ID, useValue: 'es-ES' },     // Establece español como idioma predeterminado
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
