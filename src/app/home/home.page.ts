import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getCountFromServer } from 'firebase/firestore'; // Importa desde firebase/firestore

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fechaHoraInicio: string | null = null;
  fechaHoraFinal: string | null = null;
  esInicio: boolean = true;
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

  constructor(public activateRoute: ActivatedRoute, public firestore: AngularFirestore, public route: Router) { }

  ngOnInit() {
    // Inicializa el estado si no está definido
    if (!history.state.size) {
      history.replaceState({ size: 0 }, ''); // Inicializa si no existe
    }
  }

  // Función para capturar la fecha y hora según el estado del botón
  capturarFechaHora() {
    const ahora = new Date().toLocaleString(); // Obtiene la fecha y hora actual en formato legible

    if (this.esInicio) {
      // Si es "INICIO", captura la fecha de inicio
      this.fechaHoraInicio = ahora;
    } else {
      // Si es "FINAL", captura la fecha de final
      this.fechaHoraFinal = ahora;
      this.guardarStore();
    }

    // Cambiar el estado del botón de INICIO a FINAL y viceversa
    this.esInicio = !this.esInicio;
  }

  async guardarStore() {

    await this.countDocuments();
      let item = {
        id: this.documentCount + 1,
        final: this.fechaHoraFinal || 'No definido',
        inicio: this.fechaHoraInicio || 'No definido',
        horaFinal: this.fechaHoraFinal || 'No definido',
        horaInicio: this.fechaHoraInicio || 'No definido',
        coche: this.newItem.cohe,
        conductor: this.newItem.conductor
      };

      console.log("item " + item.id);
      this.toDoList.push(item);

      // Guardar en Firestore
      let todoRef = this.firestore.doc('trayecto/' + item.id);
      todoRef.set(item).then(() => {
        console.log('Datos guardados exitosamente en Firestore');
        
        // Actualiza el tamaño en history.state para el próximo ID
        history.state.size = item.id;  // Actualiza el ID más grande 
        history.replaceState(history.state, ''); // Reemplaza el estado actual
      }).catch(error => {
        console.error('Error al guardar en Firestore: ', error);
      });
  }

  async countDocuments() {
    const db = this.firestore.firestore; // Obtener la instancia de Firestore
    const collectionRef = collection(db, 'trayecto'); // Obtener referencia a la colección
    const snapshot = await getCountFromServer(collectionRef); // Usar getCountFromServer para obtener el conteo
    this.documentCount = snapshot.data().count; // Almacenar el conteo en la variable
    console.log('Número de documentos en "trayecto":', this.documentCount);
  }




}
