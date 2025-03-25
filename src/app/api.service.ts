import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

const apiUrl = 'https://nice-roan-whippet.glitch.me/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public idCoche: number = 0; 

  /******Para mantener el valor actualizado ********/
 
  miCocheBehaviorSubject = new BehaviorSubject<string>("");
  miIdCocheBehaviorSubject = new BehaviorSubject<number>(0);
  cocheDispoBehaviorSubject = new BehaviorSubject<boolean>(true);

  newItemSubject = new BehaviorSubject<any>({
    id_usuario: 3,
    id_vehiculo: 3,
    fecha_inicio: 3,
    fecha_fin: 4,
    comentario:'',
  });

  cocheSelBehaviorSubject = new BehaviorSubject<any>({
<<<<<<< HEAD
    id_vehiculo: '',
    matricula: '',
    marca: '' ,
    modelo: '',
    ano: '',
=======
    id_vehiculo: 0,
    matricula: "",
    marca: "" ,
    modelo: "",
    ano: 0,
>>>>>>> 905bd0a6dd70c483869d16dc964ed947b23703d8
    disponible: true,
  })


  /*****    TODO lo mismo con el id del coche, me será útil **********/

  constructor(private http: HttpClient, public LoadingController: LoadingController) {}

  login1(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${apiUrl}/login`, { correo, contrasena });
  }

    login(email: string, password: string) {
      return this.http.post<{ token: string }>(`${apiUrl}/login`, { email, password }).pipe(
        tap(response => {
          sessionStorage.setItem('accessToken', response.token); // Guardamos el JWT temporalmente
        })
      );
    }

    getToken(): string | null {
      return sessionStorage.getItem('accessToken');
    }
  
    logout() {
      sessionStorage.removeItem('accessToken');
    }

    async refreshToken(): Promise<any> {
      const token = await this.getToken();
  
      if (!token) {
        throw new Error('No hay un token disponible para renovar');
      }
  
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
  
      return this.http.post(`${apiUrl}/refresh-token`, {}, { headers }).toPromise();
    }

//////////////////////  USUARIO /////////////////////////
  
  getUsuarios(): Observable<any> {
    return this.http.get(`${apiUrl}/usuarios`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${apiUrl}/usuarios`, usuario);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/usuarios/${id}`);
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${apiUrl}/usuarios/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${apiUrl}/usuarios/${id}`);
  }

  getVehiculos(): Observable<any> {
    return this.http.get(`${apiUrl}/vehiculos`);
  }
////////////////////////////////////////////////////////////////////////
  getViajes(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/viajes`);
  }

  createViaje(viaje: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/viajes`, viaje);
  }


  /////////////////////////////   vehiculo   ////////////////////////////////////
  setModeloSeleccionado(modelo: string) {
    // this.objetoModeloSeleccionado.next(modelo);
    this.miCocheBehaviorSubject.next(modelo);
  }

  getModeloSeleccionado() {
    return this.miCocheBehaviorSubject.asObservable();
  }
  setIdCoche(idCoche: number) {
    this.miIdCocheBehaviorSubject.next(idCoche);
  }
  getIdCoche(){
    return this.miIdCocheBehaviorSubject.asObservable();
  }

  //////////////////////////////// VIAJE /////////////////////////////////
  setNewItem(item:any){
    this.newItemSubject.next(item);
  }
  getNewItem(){
    return this.newItemSubject.asObservable();
  }
  getNewItemValue(): any {
    return this.newItemSubject.getValue();
  }


  setCocheSelec(id_Vehiculo: number, coche: any): Observable<any>{
    return this.http.put(`${apiUrl}/vehiculos/${id_Vehiculo}`, coche);
  }
  
  getCocheSeleccionado() {
    return this.cocheSelBehaviorSubject.asObservable();
  }

  // Setter: Actualiza el valor del BehaviorSubject
  setCocheSeleccionado(coche: any) {
    this.cocheSelBehaviorSubject.next(coche);
  }

////////////////////////////////////////////////////////////////////////////////

//////////////////   LOADING ////////////////////////

async loading(mensaje: string){
  const loading = await this.LoadingController.create({
    spinner: 'bubbles',
    //duration: 5000,
    message: mensaje,

  });
  return await loading.present();

}

  
}


