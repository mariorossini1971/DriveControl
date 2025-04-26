import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard] // Protegemos la ruta 'home' con el guard
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
 {
    path: 'vehiculos',
    loadChildren: () => import('./vehiculos/vehiculos.module').then(m => m.VehiculosModule),
    canActivate: [AuthGuard] // Protegemos la ruta 'home' con el guard
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard] // Protegemos la ruta 'home' con el guard
  },
  {
    path: 'viajes',
    loadChildren: () => import('./viajes/viajes.module').then(m => m.ViajesModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'guardar',
    loadChildren: () => import('./guardar/guardar.module').then( m => m.GuardarPageModule),
    canActivate: [AuthGuard] // Protegemos la ruta 'home' con el guard
  },
  {
    path: 'usuario-detalle',
    loadChildren: () => import('./usuario-detalle/usuario-detalle.module').then( m => m.UsuarioDetallePageModule),
    canActivate: [AuthGuard] // Protegemos la ruta 'home' con el guard
  },
  {
    path: 'usuario-detalle',
    loadChildren: () => import('./usuario-detalle/usuario-detalle.module').then( m => m.UsuarioDetallePageModule)
  },
  {
    path: 'vehiculo-detalle',
    loadChildren: () => import('./vehiculo-detalle/vehiculo-detalle.module').then( m => m.VehiculoDetallePageModule)
  
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule),
    canActivate: [AuthGuard] 
  },  {
    path: 'viaje-detalle',
    loadChildren: () => import('./viaje-detalle/viaje-detalle.module').then( m => m.ViajeDetallePageModule)
  },
  {
    path: 'historial-viajes',
    loadChildren: () => import('./historial-viajes/historial-viajes.module').then( m => m.HistorialViajesPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules
    }
      
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
