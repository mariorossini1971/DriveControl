import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-help-administrador',
    templateUrl: './help-administrador.page.html',
    styleUrls: ['./help-administrador.page.scss'],
    standalone: false
})
export class HelpAdministradorPage implements OnInit {
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
                 "<li>Usuarios</li>" +
                 "<li>Vehículos</li>" +
                 "<li>Viajes</li>" +
                 "<li>Cerrar Sesión</li>" +
                 "</ul>" +
                 "</li>" +
                 "<li><strong>Menú lateral izquierdo</strong> (clicando sobre icono hamburguesa):<br />" +
                 "<ul>" +
                 "<li>Dashboard</li>" +
                 "<li>Usuarios</li>" +
                 "<li>Vehículos</li>" +
                 "<li>Viajes Guardados</li>" +
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
  "titulo": "Usuarios - Detalle Usuario",
  "subtitulo": "Sección: Usuarios",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
                 "<ul>" +
                 "<li>Visualización de todos los usuarios registrados.</li>" +
                 "<li>Búsqueda, filtrado, creación, edición y eliminación de usuarios.</li>" +
                 "</ul><br />" +
                 "<strong>Elementos disponibles:</strong><br />" +
                 "<ol>" +
                 "<li>Buscar usuario: por nombre o correo electrónico.</li>" +
                 "<li>Ordenar: se puede ordenar alfabéticamente (ascendente o descendente) por nombre.</li>" +
                 "<li>Crear Nuevo Usuario: abre el formulario para crear un nuevo usuario.</li>" +
                 "<li>Visualizar Usuario: para ver los datos del usuario y poder desde aquí editar/eliminar usuario.</li>" +
                 "<li>Cada tarjeta de usuario muestra:<br />" +
                 "<ul>" +
                 "<li>Nombre y correo del usuario.</li>" +
                 "<li>Color de la tarjeta que indica su rol (admin – azul; gestor – verde; conductor – amarillo).</li>" +
                 "<li>Botones: 👁️ Ver ✏️ Editar 🗑️ Eliminar</li>" +
                 "</ul>" +
                 "</li>" +
                 "</ol><br />" +
                 "<strong>Al seleccionar un usuario:</strong><br />" +
                 "<ul>" +
                 "<li><strong>Detalle del Usuario</strong></li>" +
                 "<ul>" +
                 "<li>Nombre</li>" +
                 "<li>Id</li>" +
                 "<li>Correo electrónico</li>" +
                 "<li>Teléfono</li>" +
                 "<li>Rol</li>" +
                 "<li>Contraseña</li>" +
                 "</ul>" +
                 "<li><strong>Acciones:</strong></li>" +
                 "<ul>" +
                 "<li>Ver historial</li>" +
                 "<li>Editar usuario</li>" +
                 "<li>Eliminar usuario</li>" +
                 "</ul>" +
                 "</ul><br />" +
                 "<strong>Ver Historial:</strong><br />" +
                 "<ul>" +
                 "<li>Filtros por fechas o vehículo.</li>" +
                 "<li>Visualización del historial de viajes (fecha/hora, vehículo).</li>" +
                 "<li>Acciones sobre cada viaje:</li>" +
                 "<ul>" +
                 "<li>Editar o eliminar</li>" +
                 "</ul>" +
                 "</ul><br />" +
                 "<strong>Actualizar Usuario:</strong><br />" +
                 "<ul>" +
                 "<li>Tras editar, pulsa 'Guardar'.</li>" +
                 "<li>Se mostrará un mensaje de confirmación: “Usuario actualizado correctamente”</li>" +
                 "</ul><br />" +
                 "<strong>Eliminar Usuario:</strong><br />" +
                 "<ul>" +
                 "<li>Tras pulsar en 'Eliminar' se mostrará un mensaje de confirmación: “Esta acción eliminará el usuario permanentemente”</li>" +
                 "<li>Pulsando de nuevo en “Eliminar” se mostrará el mensaje: “Usuario eliminado correctamente” y quedará eliminado definitivamente</li>" +
                 "</ul><br />" +
                 "<strong>Restricciones según rol logueado:</strong><br />" +
                 "<ul>" +
                 "<li>El campo rol solo es visible y editable si el usuario logueado es administrador.</li>" +
                 "<li>Un usuario no puede eliminarse a sí mismo (protección en el botón de Eliminar).</li>" +
                 "</ul>"
},
{
  "titulo": "Usuarios/Detalle de Usuario",
  "subtitulo": "Control de Accesos",
  "descripcion": "• <strong>Subtítulo:</strong> Gestión de permisos y roles<br />" +
                 "• <strong>Descripción:</strong> Define y modifica los permisos de cada usuario, asignando roles específicos que determinen su nivel de acceso dentro de la aplicación."
},

{
  "titulo": "Vehículos / Detalle de vehículos",
  "subtitulo": "Sección: Vehículos",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
                 "<ul>" +
                 "<li>Visualización, filtrado, creación, edición y eliminación de vehículos.</li>" +
                 "</ul><br />" +
                 "<strong>Elementos disponibles:</strong><br />" +
                 "<ol>" +
                 "<li>Buscar vehículo: por matrícula.</li>" +
                 "<li>Ordenar: se puede ordenar alfabéticamente (ascendente o descendente) por nombre.</li>" +
                 "<li>Crear Vehículo: formulario para añadir un nuevo vehículo.</li>" +
                 "<li>Visualizar Vehículo: para ver los datos del vehículo y poder desde aquí editar/eliminar vehículo.</li>" +
                 "</ol><br />" +
                 "<strong>Al seleccionar un vehículo:</strong><br />" +
                 "<ul>" +
                 "<li><strong>Detalle del Vehículo</strong></li>" +
                 "<ul>" +
                 "<li>Matrícula</li>" +
                 "<li>Marca</li>" +
                 "<li>Modelo</li>" +
                 "<li>Año</li>" +
                 "<li>Disponible</li>" +
                 "</ul>" +
                 "<li><strong>Acciones:</strong></li>" +
                 "<ul>" +
                 "<li>Ver historial</li>" +
                 "<li><strong>Acciones:</strong></li>" +
                 "<li>Editar vehículo</li>" +
                 "<li>Eliminar vehículo</li>" +
                 "</ul>" +
                 "</ul><br />" +                 
                 "<strong>Ver Historial:</strong><br />" +
                 "<ul>" +
                 "<li>Filtros por fechas.</li>" +
                 "<li>Detalles del viaje (conductor, vehículo, horarios).</li>" +
                 "<li>Acciones sobre cada viaje:</li>" +
                 "<ul>" +
                 "<li>Editar o eliminar</li>" +
                 "</ul>" +
                 "</ul><br />" +
                 "<strong>Actualizar Vehículo:</strong><br />" +
                 "<ul>" +
                 "<li>Tras editar, pulsa 'Guardar'.</li>" +
                 "<li>Se mostrará un mensaje de confirmación: “Vehículo actualizado correctamente”</li>" +
                 "</ul><br />" +
                 "<strong>Eliminar Vehículo:</strong><br />" +
                 "<ul>" +
                 "<li>Tras pulsar en 'Eliminar' se mostrará un mensaje de eliminación: “Vehículo eliminado correctamente” y quedará eliminado.</li>" +
                 "</ul><br />"
},
{
  "titulo": "Viajes / Detalle de viajes",
  "subtitulo": "Sección: Viajes",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
                 "<ul>" +
                 "<li>Búsqueda, visualización, filtrado y eliminación de viajes.</li>" +
                 "</ul><br />" +
                 "<strong>Elementos disponibles:</strong><br />" +
                 "<ol>" +
                 "<li>Buscar viajes: por conductor y por vehículo.</li>" +
                 "<li>Ordenar: se puede ordenar alfabéticamente (ascendente o descendente) por nombre.</li>" +
                 "<li>Visualizar Viaje: para ver los datos del viaje y poder desde aquí editar o eliminar el viaje.</li>" +
                 "<li>Eliminar Viaje: requiere confirmación previa.</li>" +
                 "</ol><br />" +
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
                 "<li>Editar viaje</li>" +
                 "<li>Eliminar viaje</li>" +
                 "</ul>" +
                 "</ul><br />" +                
                 "<strong>Eliminar viaje:</strong><br />" +
                 "<ul>" +
                 "<li>Tras editar para eliminar, se muestra la opción de “Eliminar”.</li>" +
                 "<li>Al pulsar 'Eliminar' se muestra mensaje de confirmación: “Viaje eliminado correctamente”.</li>" +
                 "</ul><br />"
},

{
  "titulo": "Cerrar sesión",
  "subtitulo": "Sección: Cerrar sesión",
  "descripcion": "<strong>Funcionalidades:</strong><br />" +
                 "Al seleccionar \"Cerrar sesión\" saldremos de la aplicación de forma segura y nos llevará a la pantalla de inicio de sesión."
}
 ];



 
  constructor() {}

  ngOnInit() {
    this.usuarioGuardado();
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