import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';  


@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.page.html',
  styleUrls: ['./usuario-detalle.page.scss'],
})

export class UsuarioDetallePage implements OnInit {
  usuario: any = {
    id: '', 
    nombre:'', 
    correo:'',
    telefono:'',
    rol:'',
    contrasena:''
  };
  modo: 'crear' | 'ver' | 'editar' = 'ver';
  idUsuarioActual: string = ''; // id usuario logueado
  rolLogueado: string =''; 
 
  constructor(
    private router: Router,
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    // Cargar el ID del usuario actual desde localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.idUsuarioActual = usuarioLogueado.id_usuario || '';
     this.rolLogueado = usuarioLogueado.rol || '';
     console.log('ID del usuario logueado:', this.idUsuarioActual);
     console.log('Rol del usuario logueado:', this.rolLogueado); 

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    

    console.log('State recibido: ', state); // Verifica el contenido del estado

    if(state) {
      this.modo = state ['modo'] || 'ver';
      if (state['usuario']){
        this.usuario = { ...state['usuario']};

        console.log('Usuario cargado: ', this.usuario); // Verifica que el usuario tiene un id
      
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
  
  guardarUsuario(){

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
      this.apiService.updateUsuario(this.usuario.id_usuario, this.usuario).subscribe({
        next:() => {
          this.presentAlert('Éxito', 'Usuario actualizado correctamente');
          this.navCtrl.navigateBack(['/usuarios']);
          
        },
        error:() => {
          this.presentAlert('Error', 'No se pudo actualizar el usuario');
        }
      });
    } 
  }

  cancelarEdicion() {
    this.modo = 'ver'; // Cambiar de vuelta al modo de vista (no edición)
    // Otras acciones de cancelación, si es necesario, como restablecer campos
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

 /*  refrescarVista() {
    // Forzar la actualización de la vista manualmente, si es necesario
    window.location.reload(); // Esto recarga la página completa
  } */

async presentAlert (titulo:string, mensaje:string){
    const alert = await this.alertController.create({
      header:titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
