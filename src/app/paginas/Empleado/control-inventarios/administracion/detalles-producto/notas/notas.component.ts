import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss'],
})
export class NotasComponent implements OnInit {

  form: FormGroup;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Note: ["",[Validators.required]],
    });
  }

  saveFinalNote()
  {
    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Producto')).update(
    {
      FinalNote: this.form.value.Note,
    }).then(()=>{
      this.generalSvc.presentToast('toastSuccess','Nota guardada correctamente');
      this.modalCtrl.dismiss();
    }).catch((err)=>{
    this.generalSvc.presentToast('customToast',err);
    });
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

}
