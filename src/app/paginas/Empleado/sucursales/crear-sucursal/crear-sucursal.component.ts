import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-crear-sucursal',
  templateUrl: './crear-sucursal.component.html',
  styleUrls: ['./crear-sucursal.component.scss'],
})
export class CrearSucursalComponent implements OnInit {

  form: FormGroup;
  constructor(private modalCtrl: ModalController,
    private dataSvc:DatosService,
    private generalSvc: GeneralService,
    private formBuilder: FormBuilder,
    private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Name: ["",[Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      Password: ["",[Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });
  }

  saveSubsidiary()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Sucursales')).push({
        Name: this.Name.value,
        Boss: this.dataSvc.getEmployeeCode(),
        Password: this.Password.value
      }).then(()=>{
        this.generalSvc.presentToast('toastSuccess', 'Sucursal registrada correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.generalSvc.presentToast('customToast', err);
      })
    }
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  get Name()
  {
    return this.form.get('Name');
  }
  
  get Password()
  {
    return this.form.get('Password');
  }

}
