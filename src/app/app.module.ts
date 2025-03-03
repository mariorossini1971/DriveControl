import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule} from '@angular/fire/compat';
import { AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment} from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
//import { firebaseConfig } from 'src/environments/environment';

const firebaseConfig = {
  apiKey: "AIzaSyCFqrOUi_tEEAsvp4P4xCBKMcMVZHIm7pc",
  authDomain: "ionicproject-d9cce.firebaseapp.com",
  projectId: "ionicproject-d9cce",
  storageBucket: "ionicproject-d9cce.appspot.com",
  messagingSenderId: "243766640179",
  appId: "1:243766640179:web:2ba71f12900c245863ad46",
  measurementId: "G-ZVTKH33DS2"
};

@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  AngularFireModule.initializeApp(firebaseConfig), AngularFirestoreModule,
  AngularFireAuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
