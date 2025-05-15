import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular'; 
import { MenuController, } from '@ionic/angular';
import { Capacitor } from '@capacitor/core'; 
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-usuario-detalle',
    templateUrl:'./usuario-detalle.page.html',
    styleUrls: ['./usuario-detalle.page.scss'],
    standalone: false
})

export class UsuarioDetallePage implements OnInit {

    private subscripciones = new Subscription(); 
      
  
  usuario: any = {
    id_usuario: '', 
    nombre:'', 
    correo:'',
    telefono:'',
    rol:'',
    contrasena:''
  };
  modo: 'crear' | 'ver' | 'editar' = 'ver';
  idUsuarioActual: string = ''; // id usuario logueado
  rolLogueado: string =''; 
  nombre: string = '';
  contrasenaControl: string = '';
  colorBar: string = '#FFFFFF';
 
  constructor(
    private router: Router,
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private cdr: ChangeDetectorRef
    
  ) { }

  ngOnInit() {

    this.activarMenu();
    this.controlRol();
    this.funcionPrincipal(); 
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
        this.apiService.setStatusBarColor(this.colorBar);
      };
  }
  ionViewWillEnter(){
    this.activarMenu();
    this.controlRol();
//    this.funcionPrincipal(); 
  }
  
  guardarUsuario(){

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!this.usuario.correo || !emailRegex.test(this.usuario.correo)) {
      this.presentAlert('Error', 'Por favor, introduce un correo válido.');
      return;
    }

    if (!this.usuario.contrasena) {
      this.presentAlert('Error','La contraseña es obligatoria.');
      return;
    }

    console.log("Usuario a guardar:", this.usuario); // Verifica qué datos estás enviando
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.rol) {
      this.presentAlert('Campos requeridos', 'Debes completar los campos');
      return;
    }
 
    if (this.modo === 'crear'){
        // Eliminar id_usuario para evitar enviarlo al servidor al crear un nuevo usuario
      const { id, ...usuarioSinId } = this.usuario;

      this.apiService.createUsuario(usuarioSinId).subscribe({
        next: () => {
          this.presentAlert('Éxito', 'Usuario creado correctamente');
          this.navCtrl.navigateBack(['/usuarios']);
        },
        error:() => {
          console.error("Error al crear usuario", Error); // Log de error
          this.presentAlert('Error', 'No se pudo crear el usuario');
        }
      });
    }
       
    if (this.modo === 'editar' && this.usuario.id_usuario){
        const datosUsuario = { ...this.usuario };
        if(this.contrasenaControl === this.usuario.contrasena){
            console.log( "**************************contraseñas igiales")
            delete datosUsuario.contrasena;
        }
        console.log("contraseña:    ",datosUsuario.contraseña)
        this.apiService.updateUsuario(this.usuario.id_usuario, datosUsuario).subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.presentAlert('Éxito', 'Usuario actualizado correctamente');
           if(this.rolLogueado === 'conductor'){
               this.navCtrl.navigateBack(['/principal']);
           }else{
              this.navCtrl.navigateBack(['/usuarios']);
           }
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
            this.presentAlert('Error', 'No se pudo actualizar el usuario');
          }
        });
      }   
    } 
  

  cancelarEdicion() {
    
    this.modo = 'ver'; // Cambiar de vuelta al modo de vista (no edición)
    //this.navCtrl.navigateBack(['/principal']);

  }

  async eliminarUsuario(){
    if(!this.usuario.id_usuario) return;

    // evitar que se elimine a sí mismo
    if (this.usuario.id_usuario === this.idUsuarioActual) {
      this.presentAlert('Acción no permitida', 'No puedes eliminar tu propio usuario.');
      return;
    }

    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Esta acción eliminará el usuario permanentemente',
      buttons:[{
        text:'Cancelar',
        role:'cancel',
        handler: () => {
          console.log('Eliminación cancelada');
          this.navCtrl.navigateBack('/usuarios');
        }
      },
    {
      text:'Eliminar',
      role:'destructive',
      handler:() => {
        this.apiService.deleteUsuario(this.usuario.id_usuario).subscribe({
          next: () => {
            this.presentAlert('Eliminado', 'Usuario eliminado correctamente');
            this.navCtrl.navigateBack('/usuarios');
          },
          error:() => {
            this.presentAlert('Error', 'No se pudo eliminar el usuario');
          }
        });
       }
    }
    
    ]
    });
    await alert.present();
}

  cancelar(){
    this.navCtrl.navigateBack(['/usuarios']);
  }

async presentAlert (titulo:string, mensaje:string){
    const alert = await this.alertController.create({
      header:titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  funcionPrincipal(){

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    
    console.log('State recibido: ', state); // Verifica el contenido del estado

    if(state) {
      this.modo = state ['modo'] || 'ver';
      console.log('el modo recibido es.... ', this.modo);

      if (this.modo === 'crear') {
        return;
      }else if (state['usuario']){
    
        this.usuario = state['usuario'];

        console.log('Usuario cargado: ', this.usuario); // Verifica que el usuario tiene un id
        this.contrasenaControl = this.usuario.contrasena;
        console.log("contraseña = ", this.contrasenaControl);
      
      } else if ( this.modo === 'editar' || this.modo === 'ver'){
        this.presentAlert('Error', 'No se proporcionó el usuario a editar/ver');
        this.navCtrl.navigateBack('/usuarios');
       
      }
    }else{
      // Si no se pasa el estado, redirige de nuevo
      this.presentAlert('Error', 'No se proporcionó el estado del usuario');
      this.navCtrl.navigateBack('/usuarios');
         }
    console.log("Modo actual:", this.modo);
    
  }

activarMenu(){
  if (this.rolLogueado === 'admin' || this.rolLogueado === 'gestor') {
    this.menuCtrl.enable(true, 'menuAdmin'); // Activa el menú de administrador
    this.menuCtrl.enable(false, 'menu'); // Desactiva el menú de conductor
  } else if (this.rolLogueado === 'conductor') {
    this.menuCtrl.enable(true, 'menu'); // Activa el menú de conductor
    this.menuCtrl.enable(false, 'menuAdmin'); // Desactiva el menú de administrador
  }
}

controlRol(){
  this.apiService.cargarRol();
  this.apiService.rol$.subscribe((rol) => {
    this.rolLogueado = rol; // Actualiza el valor local
  });
  this.cdr.detectChanges();
  try {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
     const usuariolog = JSON.parse(usuarioLogueado); 
      this.idUsuarioActual = usuariolog.id_usuario;
      this.nombre = usuariolog.nombre;
      this.cdr.detectChanges();
    }
  } catch (error) {
    console.error('Error al leer el usuario desde localStorage:', error);
  }
}

}
