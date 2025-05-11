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
    loadChildren: () => import('./viajes/viajes.module').then(m => m.ViajesModule),
    canActivate: [AuthGuard] 
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
    loadChildren: () => import('./usuario-detalle/usuario-detalle.module').then( m => m.UsuarioDetallePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'vehiculo-detalle',
    loadChildren: () => import('./vehiculo-detalle/vehiculo-detalle.module').then( m => m.VehiculoDetallePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'viaje-detalle',
    loadChildren: () => import('./viaje-detalle/viaje-detalle.module').then( m => m.ViajeDetallePageModule),
  },
  {
    path: 'historial-viajes',
    loadChildren: () => import('./historial-viajes/historial-viajes.module').then( m => m.HistorialViajesPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'help-administrador',
    loadChildren: () => import('./help-administrador/help-administrador.module').then( m => m.HelpAdministradorPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'help-conductor',
    loadChildren: () => import('./help-conductor/help-conductor.module').then( m => m.HelpConductorPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'help-gestor',
    loadChildren: () => import('./help-gestor/help-gestor.module').then( m => m.HelpGestorPageModule),
    canActivate: [AuthGuard] 
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
