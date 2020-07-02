import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private toastCtrl: ToastController,
    private db:AngularFireDatabase) { }

  async mensaje(clase:any,message:any)
  {
    const toast = await this.toastCtrl.create({
      cssClass: clase,
      message: message,
      duration: 3000
    });
    await toast.present();
  }

  insertarenlaBD(ruta:any, datos:any)
  {
    return this.db.database.ref(ruta).set(datos);
  }
}
