import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  

  if (token && !tokenExpirado(token)) {
    // Si el token existe y no ha expirado, permitir el acceso
    return true;
  } else {
    // Si el token ha expirado o no existe, redirigir al login
    console.log('Token expirado o no válido');
    router.navigate(['/login']);
    return false;
  }

  function tokenExpirado(token: string): boolean {
    if (!token) {
      return true;
    }
    try {
      const payload: any = jwtDecode(token);
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp < ahora; // Verifica si el token ha caducado
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return true; // Considera el token como expirado si no se puede decodificar
    }
  }
};
