import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private toastCtrl: ToastController) { }

  async mensaje(clase:any,message:any)
  {
    const toast = await this.toastCtrl.create({
      cssClass: clase,
      message: message,
      duration: 3000
    });
    await toast.present();
  }
}
