import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Usuario } from './models/usuario.model';
import { StatusBar } from '@capacitor/status-bar'

const apiUrl = 'https://nice-roan-whippet.glitch.me/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public idCoche: number = 0; 

  /////// Para el StatusBar

  setStatusBarColor(color: string) {
    StatusBar.setBackgroundColor({ color });
  }

  /******Para mantener el valor actualizado ********/
 
  miCocheBehaviorSubject = new BehaviorSubject<string>("");
  miIdCocheBehaviorSubject = new BehaviorSubject<number>(0);
  cocheDispoBehaviorSubject = new BehaviorSubject<boolean>(true);
  //rolBehaviorSubject = new BehaviorSubject<string>("");
  private rolBehaviorSubject = new BehaviorSubject<string>(
    localStorage.getItem('rol') || ''
  );
  
  rol$ = this.rolBehaviorSubject.asObservable();     // para subscribirme desde todas las ts

  newItemSubject = new BehaviorSubject<any>({
    id_usuario: 3,
    id_vehiculo: 3,
    fecha_inicio: 3,
    fecha_fin: 4,
    comentario:'',
  });

  newCoordenadasSubject = new BehaviorSubject<any>({
    latInicial: 0,
    lngInicial: 0,
    latFinal: 0,
    lngfinal: 0,
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

  private usuarioSubject = new BehaviorSubject<any>(this.getUsuarioLocalStorage());

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
//////////////////////////////////////  VEHICULOS //////////////////////////////

  createVehiculo(vehiculo: any): Observable<any> {
    return this.http.post(`${apiUrl}/vehiculos`, vehiculo);
  }
  getVehiculos(): Observable<any> {
    return this.http.get(`${apiUrl}/vehiculos`);
  }
  getVehiculoById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/vehiculos/${id}`);
  }
  updateVehiculo(id: number, vehiculo: any): Observable<any>{
    return this.http.put(`${apiUrl}/vehiculos/${id}`, vehiculo);
  }

  deleteVehiculo(id:number): Observable<any> {
    return this.http.delete(`${apiUrl}/vehiculos/${id}`);
  }
 
  updateEstadoVehiculo(id: number, disponible: number): Observable<any> {
    return this.http.put<any>(`${apiUrl}/vehiculosestado/${id}`, { disponible });
  }

  getHistorialViaje(id: number): Observable<any>{
    return this.http.get(`${apiUrl}/viajes/vehiculo/${id}`);
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
    return this.http.get<any>(`${apiUrl}/viajescomentario`);
  }

  getViajesById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/viajes/usuario/detalladocomentario/${id}`);
  }
  getViajesByIdDetallado(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/viajes/detalladocomentario/${id}`);
  }

  createViaje(viaje: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/viajescomentario`, viaje);
  }
  deleteViaje(id:number): Observable<any> {
    return this.http.delete(`${apiUrl}/viajes/${id}`);
  }

  getViajesConCoordenadas():Observable<any> {
    return this.http.get<any>(`${apiUrl}/detalladoCoordenadas`);
  }
  getCoordenadasById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/detalladoCoordenadas/${id}`);
  }

  guardarCoordenadas(coordenadas: any): Observable<any> {
    return this.http.post(`${apiUrl}/coordenadas`, coordenadas);
  }
  

  
  ///////////////////////////// ROL /////////////////////////////////////
  cargarRol(): void {
    try {
      const rolLocalStorage = localStorage.getItem('rol');
      if (rolLocalStorage) {
        this.rolBehaviorSubject.next(rolLocalStorage); // Actualiza el BehaviorSubject
        console.log('Rol cargado desde localStorage:', rolLocalStorage);
      } else {
        console.warn('No se encontró un rol en localStorage. Usando rol "visitante".');
        this.rolBehaviorSubject.next('visitante'); // Valor por defecto
      }
    } catch (error) {
      console.error('Error al cargar el rol:', error);
      this.rolBehaviorSubject.next('visitante'); // En caso de error
    }
  }

    // Método para actualizar el rol manualmente
    actualizarRol(nuevoRol: string): void {
      this.rolBehaviorSubject.next(nuevoRol); // Cambia el rol globalmente
      localStorage.setItem('rol', nuevoRol); // Actualiza en localStorage
      console.log('Rol actualizado a:', nuevoRol);
    }


    setRol(rol: string){
      this.rolBehaviorSubject.next(rol);
      console.log('he grabado el rol: ', this.rolBehaviorSubject.value);
    }
    getRol(){
      return this.rolBehaviorSubject.asObservable();
    }

  /////////////////////////////   vehiculo  observable ////////////////////////////////////

    setModeloSeleccionado(modelo: string) {
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
    //// coordenadas
    setNewCoordenadas(item:any){
      this.newCoordenadasSubject.next(item);
    }
    getNewCoordenadas(){
      return this.newCoordenadasSubject.asObservable();
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
    localStorage.clear();
    sessionStorage.clear();
    console.log('Sesión cerrada');
  }

}


