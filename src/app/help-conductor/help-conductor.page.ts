import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-help-conductor',
    templateUrl: './help-conductor.page.html',
    styleUrls: ['./help-conductor.page.scss'],
    standalone: false
})
export class HelpConductorPage implements OnInit {
  usuario = {
    nombre: '',
    correo: ''
  };
  filtroTexto: string = '';
  temas: Array<{ titulo: string; subtitulo: string; descripcion: string }> = [
    {
      "titulo": "Inicio de Sesión",
      "subtitulo": "1.Acceso a la aplicación DriveControl",
      "descripcion": "Para comenzar, accede a la plataforma con tus credenciales personales:\n\n" +
                 "<ul>" +
                 "<li><strong>Correo electrónico:</strong> Introduce tu email corporativo. Este se usará como identificador de usuario.</li>" +
                 "<li><strong>Contraseña:</strong> Ingresa tu contraseña personal. Puedes ver u ocultar la contraseña usando el icono de ojo 👁️ que aparece a la derecha del campo.</li>" +
                 "</ul>" +
                 "Una vez completados ambos campos, pulsa el botón <strong>\"Iniciar sesión\"</strong> / <strong>\"Login\"</strong> para acceder a la aplicación."
},
{
  "titulo": " Inicio de Sesión",
  "subtitulo": "2.Error en el acceso",
  "descripcion": "Si introduces un correo o contraseña incorrectos, aparecerá el siguiente mensaje:<br /><br />" +
             "<strong>Email/Password Inválido</strong><br /><br />" +
             "Verifica los datos introducidos y vuelve a intentarlo."    
},
{
  "titulo": "Inicio de Sesión",
  "subtitulo": "3. Seguridad y gestión de sesión",
  "descripcion": "Al iniciar sesión correctamente, se realizan las siguientes acciones:<br /><br />" +
                 "<ul>" +
                 "<li>Se guarda de forma segura un token de acceso en tu dispositivo.</li>" +
                 "<li>Se detecta automáticamente tu rol de usuario (Administrador, Gestor o Conductor).</li>" +
                 "<li>Se redirige a la página principal.</li>" +
                 "</ul>" +
                 "Esto asegura que solo los usuarios autorizados puedan acceder y ver únicamente las funcionalidades habilitadas para ellos."
},
{
  "titulo": "Página Principal - Dashboard",
  "subtitulo": "Sección: Dashboard",
  "descripcion": "Una vez dentro, se muestra:<br /><br />" +
                 "<ol>" +
                 "<li><strong>Menú central:</strong><br />" +
                 "<ul>" +
     "<li>Iniciar Viaje</li>" +
                 "<li>Mi Perfil</li>" +
                 "<li>Vehículos</li>" +
                 "<li>Mis Viajes</li>" +
                 "<li>Cerrar Sesión</li>" +
                 "</ul>" +
                 "</li>" +
                 "<li><strong>Menú lateral izquierdo</strong> (clicando sobre icono hamburguesa):<br />" +
                 "<ul>" +
                 "<li>Dashboard</li>" +
                 "<li>Usuarios</li>" +
                 "<li>Vehículos</li>" +
                 "<li>Viajes</li>" +
                 "<li>Cerrar Sesión</li>" +
                 "</ul>" +
                 "</li>" +
                 "<li><strong>Área inferior:</strong><br />" +
                 "<ul>" +
                 "<li>Usuario logueado</li>" +
                 "<li>Empresa</li>" +
                 "</ul>" +
                 "</li>" +
                 "</ol><br />" +
                 "Todos los campos de los menús central y lateral son clicables y te llevan a la página en cuestión."
},

{
  "titulo": "Home - Iniciar Viaje",
  "subtitulo": "Sección: Iniciar Viaje",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
  "<ul>" +
  "<li>Esta es la pantalla que configuramos para realizar el viaje.</li>" +
  "</ul><br />" +
  "<strong>Al seleccionar Iniciar Viaje:</strong><br />" +
  "<ul>" +
  "<li><strong>Se muestra:</strong>" +
  "<ul>" +
  "<li>Seleccionar Vehículo</li>" +
  "<li>Cronómetro con el tiempo transcurrido desde el inicio</li>" +
  "<ul>" +
  "<li>Este contador se activa automáticamente al iniciar el viaje y se detiene al finalizarlo.</li>" +
  "</ul>" +
  "</ul>" +
  "</li>" +
  "<li><strong>Acciones:</strong>" +
  "<ul>" +
  "<li>Seleccionar Vehículo</li>" +
  "<li>Iniciar/Finalizar Viaje</li>" +
  "<ul>" +
  "<li>Comentarios</li>" +
  "</ul>" +
  "</ul>" +
  "</li>" +
  "</ul><br />" +
  "<strong>Iniciar/Finalizar tu viaje:</strong><br />" +
  "<ul>" +
  "<li>Desliza el botón hacia la derecha para iniciar o finalizar tu trayecto.</li>" +
  "<li>Al deslizar:" +
  "<ul>" +
  "<li>Se guarda la fecha y hora de inicio o de finalización.</li>" +
  "<li>El cronómetro se activa o se detiene.</li>" +
  "<li>La pantalla se bloquea para evitar cambios hasta finalizar.</li>" +
  "</ul>" +
  "</li>" +
  "<li>Serás redirigido a la pantalla de comentarios una vez finalizado el trayecto, donde puedes añadir comentarios sobre el trayecto, vehículo o cualquier incidencia.</li>" +
  "</ul>"
},

{
  "titulo": "Home – Iniciar Viaje",
  "subtitulo": "Sección: Menú y navegación",
  "descripcion": "En la parte superior:<br />" +
    "<ul>" +
      "<li><strong>Menú lateral izquierdo</strong> (clicando sobre icono hamburguesa):" +
        "<ul>" +
          "<li>Dashboard</li>" +
          "<li>Usuarios</li>" +
          "<li>Vehículos</li>" +
          "<li>Viajes</li>" +
          "<li>Cerrar Sesión</li>" +
        "</ul>" +
      "</li>" +
      "<li>Menú desactivado: la página está 'bloqueada' durante un trayecto en curso.</li><br />" +
      "<li>🔙 A la derecha hay un botón para volver atrás (se desactiva durante un trayecto).</li><br />" +
      "<li>Si no has seleccionado vehículo, no podrás iniciar el trayecto.</li><br />" +
      "<li>Bloqueo temporal de la página:" +
        "<ul>" +
          "<li>Mientras el trayecto está en curso:</li>" +
          "<ul>" +
            "<li>No podrás seleccionar otro coche.</li>" +
            "<li>No podrás volver atrás.</li>" +
            "<li>El menú lateral también está desactivado.</li>" +
          "</ul>" +
          "<li>Esto es para garantizar que no se pierde la información del trayecto en curso.</li>" +
        "</ul>" +
      "</li><br />" +
      "<li><strong>Consejo:</strong>" +
        "<ul>" +
          "<li>Siempre finaliza el trayecto y añade tus comentarios antes de cerrar la app. Si olvidas hacerlo, el viaje puede quedar incompleto en la base de datos.</li>" +
        "</ul>" +
      "</li>" +
    "</ul>"
},
{
  "titulo": "Vehículos / Detalle de vehículos",
  "subtitulo": "Sección: Vehículos",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
    "<ul>" +
      "<li>Visualización y filtrado de vehículos.</li>" +
    "</ul><br />" +
    "<strong>Elementos disponibles:</strong><br />" +
    "<ol>" +
      "<li>Buscar vehículo: por matrícula.</li>" +
      "<li>Ordenar: se puede ordenar alfabéticamente (ascendente o descendente) por nombre.</li>" +
      "<li>Visualizar Vehículo: para ver los datos del vehículo y desde aquí editar o eliminar.</li>" +
    "</ol><br />" +
    "<strong>Al seleccionar un vehículo:</strong><br />" +
    "<ul>" +
      "<li><strong>Detalle del Vehículo:</strong>" +
        "<ul>" +
          "<li>Matrícula</li>" +
          "<li>Marca</li>" +
          "<li>Modelo</li>" +
          "<li>Año</li>" +
          "<li>Disponible</li>" +
        "</ul>" +
      "</li>" +
      "<li><strong>Acciones:</strong>" +
        "<ul>" +
          "<li>Ver historial</li>" +
          "<li>Editar vehículo</li>" +
          "<li>Eliminar vehículo</li>" +
        "</ul>" +
      "</li>" +
    "</ul><br />" +
    "<strong>Ver Historial:</strong><br />" +
    "<ul>" +
      "<li>Filtros por fechas.</li>" +
      "<li>Detalles del viaje (conductor, vehículo, horarios).</li>" +
    "</ul><br />"
},

{
  "titulo": "Viajes / Mis viajes",
  "subtitulo": "Sección: Mis viajes",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
                 "<ul>" +
                 "<li>Visualización y filtrado de viajes.</li>" +
                 "</ul><br />" +
                 "<strong>Al seleccionar un viaje:</strong><br />" +
                 "<ul>" +
                 "<li><strong>Se muestra:</strong></li>" +
                 "<ul>" +
                 "<li>Conductor</li>" +
                 "<li>Vehículo</li>" +
                 "<li>Fecha de inicio</li>" +
                 "<li>Fecha de fin</li>" +
                 "</ul>" +
                 "<li><strong>Acciones:</strong></li>" +
                 "<ul>" +
                 "<li>Visualizar Viaje</li>" +
                 "</ul>" +
                 "</ul><br />"                
                 
},
{
  "titulo": "Cerrar sesión",
  "subtitulo": "Sección: Cerrar sesión",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
                 "Al seleccionar \"Cerrar sesión\" saldremos de la aplicación de forma segura y nos llevará a la pantalla de inicio de sesión."
}
 ];
 
 colorBar: string = '#FFFFFF';

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.usuarioGuardado();
    if (Capacitor.isNativePlatform()) {                     ///// El If es para controlar que no estamos en PC
              this.apiService.setStatusBarColor(this.colorBar);
            };
  }

  get temasFiltrados() {
    if (!this.filtroTexto || this.filtroTexto.trim() === '') {
      return this.temas;
    }
    const texto = this.filtroTexto.toLowerCase();
    return this.temas.filter(tema =>
      tema.titulo.toLowerCase().includes(texto) ||
      tema.subtitulo.toLowerCase().includes(texto) ||
      tema.descripcion.toLowerCase().includes(texto)
    );
  }

usuarioGuardado(){
      const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado); // Recupera los datos del usuario
    } else {
      console.warn('Usuario no encontrado.');
    }
 }
}
