import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Usuario } from './models/usuario.model';

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
  rolBehaviorSubject = new BehaviorSubject<string>("");
  

  newItemSubject = new BehaviorSubject<any>({
    id_usuario: 3,
    id_vehiculo: 3,
    fecha_inicio: 3,
    fecha_fin: 4,
    comentario:'',
  });

  cocheSelBehaviorSubject = new BehaviorSubject<any>({
    id_vehiculo: 0,
    matricula: "",
    marca: "" ,
    modelo: "",
    ano: 0,
    disponible: true,
  });
    usaurioBehaviorSubject = new BehaviorSubject<any>({
    id_usuario: 0,
    nombre: "",
    rol: "" ,
    correo: "",
    telefono: 0,
    contrasena: 0,
  });



 // private usuarioSubject = new BehaviorSubject<any>(null); // Inicializa vacío o con datos desde localStorage
//  public usuario$ = this.usuarioSubject.asObservable();


  private usuarioSubject = new BehaviorSubject<any>(this.getUsuarioLocalStorage());
//  private usuarioSubject: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>(
//    new Usuario(0, 'otro', '', '', '')
//  );

//  public usuario$: Observable<Usuario> = this.usuarioSubject.asObservable();

  /*****    TODO lo mismo con el id del coche, me será útil **********/

  constructor(private http: HttpClient, public LoadingController: LoadingController) {}

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${apiUrl}/login`, { correo, contrasena });
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
  /////////////////////////////// USUARIO OBSERVABLE /////////////////////////////
  get usuario$() {
    return this.usuarioSubject.asObservable();
  }

  setUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  private getUsuarioLocalStorage() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }


 
  setUsuarioObs(usuario: any){
    this.usaurioBehaviorSubject.next(usuario);
    console.log('Usuario enviado al BehaviorSubject:', usuario);
  }
  getUsuarioObs(): Observable<any> {
    return this.usaurioBehaviorSubject.asObservable();
  }
  getUsuarioValue(): any {
    return this.usaurioBehaviorSubject.getValue();
  }


 ////////////////////////////////   VIAJES  ///////////////////////////////////////
  getViajes(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/viajes`);
  }

  createViaje(viaje: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/viajes`, viaje);
  }


  /////////////////////////////   vehiculo  observable ////////////////////////////////////
  
  setRol(rol: string){
    this.rolBehaviorSubject.next(rol);
    console.log('he grabado el rol: ', this.rolBehaviorSubject.value);
  }
  getRol(){
    return this.rolBehaviorSubject.asObservable();
  }

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
actualizarUsuario(usuario: Usuario): void {
  this.usuarioSubject.next(usuario);
}
/////////  USUARIO ////////////////////////////////


//////////////////   LOADING ////////////////////////

async loading(mensaje: string){
  const loading = await this.LoadingController.create({
    spinner: 'bubbles',
    //duration: 5000,
    message: mensaje,

  });
  return await loading.present();

}
//////////////////////////// CIERRE SESION ////////////////////////
/* LIMPIO MEMORIA */
cerrarSesion(){
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('rol');
  sessionStorage.clear();
  console.log('Sesión cerrada');
}
  
}


