import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getCountFromServer } from 'firebase/firestore'; // Importa desde firebase/firestore

import { ApiService } from '../api.service';  // Importa el servicio API

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fechaHoraInicio: string | null = null;
  fechaHoraFinal: string | null = null;
  esInicio: boolean = true;
  mostrarGuardar: boolean = false;
  tiempoTranscurrido: number = 0;  // Guardar el tiempo transcurrido en segundos
  interval: any;  // Controla el intervalo del temporizador
  minuto: number = 0;
  segundo: number = 0;
  hora: number = 0;

  mensaje: string = ' '; 

  vehiculos: any[] = [];
  modeloSeleccionado: string = "uno";
  idCocheSeleccionado: number = 0;

  tiempoFormateado: string = '0 segundos';  // Inicializar el formato

  documentCount: number = 0; // Variable para contar los documentos
  toDoList: any[] = [];
  newItem = {
    final: 'final',
    inicio: 'inicio',
    horaFinal: 'Hfinal',
    horaInicio: 'hInicio',
    cohe: 'moto',
    conductor: 'mario'
  };

  constructor(
    public activateRoute: ActivatedRoute, 
    public firestore: AngularFirestore, 
    private apiService: ApiService,  // Inyecta el servicio API
    public route: Router) { }

  ngOnInit() {
    // Inicializa el estado si no está definido
    if (!history.state.size) {
      history.replaceState({ size: 0 }, ''); // Inicializa si no existe
    }
    this.countDocuments();  // Llama a countDocuments para inicializar el conteo
    this.cargarDatosVehiculos();
  }

  // Función para capturar la fecha y hora según el estado del botón
  capturarFechaHora() {
    //const ahora = new Date().toLocaleString(); // Obtiene la fecha y hora actual en formato legible
    const ahora = new Date().toISOString().split('.')[0] + 'Z';
    if (this.esInicio) {
      // Si es "INICIO", captura la fecha de inicio
      this.fechaHoraInicio = ahora;
      this.iniciarTemporizador();  // Iniciar el temporizador
    } else {
      // Si es "FINAL", captura la fecha de final
      this.fechaHoraFinal = ahora;
      this.detenerTemporizador();  // Detener el temporizador
 //     this.guardarStore();     solo para hacer pruebas, luego hay que borrarlo ********************************
      this.mostrarGuardar = true; 
    }

    // Cambiar el estado del botón de INICIO a FINAL y viceversa
    this.esInicio = !this.esInicio;
    
  }

  async guardarStore() {
/*
    if (!this.fechaHoraInicio || !this.fechaHoraFinal) {
      console.error('Error: no se pueden guardar los datos sin un inicio y un final definidos.');
      return;
    }
*/
    this.mensaje = "Guardando Datos";
    this.mostrarGuardar = !this.mostrarGuardar;
  //  this.reiniciarEstado();
    await this.countDocuments();
    /*  let item = {
        id: this.documentCount + 1,
        final: this.fechaHoraFinal || 'No definido',
        inicio: this.fechaHoraInicio || 'No definido',
        horaFinal: this.fechaHoraFinal || 'No definido',
        horaInicio: this.fechaHoraInicio || 'No definido',
       // coche: this.newItem.cohe,
        coche: this.modeloSeleccionado,
        conductor: this.newItem.conductor
      };*/

      let viaje = {
        id: this.documentCount + 1,
        id_usuario: 3,  
        id_vehiculo: this.apiService.idCoche, 
        fecha_inicio: this.fechaHoraInicio || 'No definido',
        fecha_fin: this.fechaHoraFinal || 'No definido'
      }
      console.log("Preparado para guardar el viaje ");
   //   console.log("Preparado para guardar el item " + item.id);
   //   this.toDoList.push(item);
/*
      // Guardar en Firestore
      let todoRef = this.firestore.doc('trayecto/' + item.id);
      todoRef.set(item).then(() => {
        console.log('Datos guardados exitosamente en Firestore');        
        // Actualiza el tamaño en history.state para el próximo ID
        history.state.size = item.id;  // Actualiza el ID más grande 
        history.replaceState(history.state, ''); // Reemplaza el estado actual
        this.reiniciarEstado();
      }).catch(error => {
        console.error('Error al guardar en Firestore: ', error);
      });
      
*/
// Guardar en la API
this.apiService.createViaje(viaje).subscribe(response => {
  console.log('Datos guardados exitosamente en la API');
  // Actualiza el tamaño en history.state para el próximo ID
  history.state.size = viaje.id;  // Actualiza el ID más grande 
  history.replaceState(history.state, ''); // Reemplaza el estado actual
  this.reiniciarEstado();
}, error => {
  console.error('Error al guardar en la API: ', error);
});

setTimeout(() => {
  this.mensaje = 'Datos guardados con éxito ✅';
  console.log('Datos guardados con éxito ✅');

  setTimeout(() => {
    this.mensaje = ''; // Borra el mensaje después de 2 segundos
    this.mostrarGuardar = false; // Vuelve a mostrar el botón INICIO
    this.esInicio = true; // Reinicia el estado para INICIO
  }, 2000); // Desaparece el mensaje después de 2 segundos
}, 2000); // Muestra "Guardando datos..." por 2 segundos

      
  }

  async countDocuments() {
    const db = this.firestore.firestore; // Obtener la instancia de Firestore
    const collectionRef = collection(db, 'trayecto'); // Obtener referencia a la colección
    const snapshot = await getCountFromServer(collectionRef); // Usar getCountFromServer para obtener el conteo
    this.documentCount = snapshot.data().count; // Almacenar el conteo en la variable
    console.log('Número de documentos en "trayecto":', this.documentCount);
  }

  iniciarTemporizador() {
    this.segundo = 0;  // Reiniciar el contador de tiempo
    this.interval = setInterval(() => {
      this.segundo++;
      if (this.segundo == 60){
        this.minuto ++;
        this.segundo = 0;
      }
    }, 1000);  // Aumenta el tiempo cada segundo
  }
    
  detenerTemporizador() {
    clearInterval(this.interval);  // Detener el intervalo
  }

  reiniciarEstado() {
   // this.esInicio = true; // Vuelve a mostrar INICIO
    this.fechaHoraInicio = null; // Limpia la hora de inicio
    this.fechaHoraFinal = null; // Limpia la hora de final
    this.minuto = 0; // Reinicia el temporizador
    this.segundo = 0; // Reinicia el temporizador
  }

  cargarDatosVehiculos(){
    this.apiService.getVehiculos().subscribe((data: any[]) => {
      this.vehiculos = data;
    });
  }
  calculaIdVehiculo(){
    //console.log('Modelo seleccionado:', this.modeloSeleccionado);
    for (let i = 0; i < this.vehiculos.length; i++){
    //  console.log('indice: ', i, this.vehiculos[i].id_vehiculo, this.vehiculos[i].modelo);

      if(this.vehiculos[i].modelo.trim() === this.modeloSeleccionado.trim()){       //trim () elimina espacios, sin el no me funciona
        this.idCocheSeleccionado = this.vehiculos[i].id_vehiculo;
       // console.log('id vehiculo: ', this.vehiculos[i].id_vehiculo);
        break;
      }
    }
  }
}