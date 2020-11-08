import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventario-actual',
  templateUrl: './inventario-actual.component.html',
  styleUrls: ['./inventario-actual.component.scss'],
})
export class InventarioActualComponent implements OnInit {

  form: FormGroup;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Cuantity: ["",[Validators.required]],
    });
  }

  updateActualInventory()
  {
    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Producto')).update(
    {
      ActualInventory: this.form.value.Cuantity,
    }).then(()=>{
      this.generalSvc.presentToast('toastSuccess','Datos actualizados correctamente');
      this.modalCtrl.dismiss();
    }).catch((err)=>{
    this.generalSvc.presentToast('customToast',err);
    });
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }
}