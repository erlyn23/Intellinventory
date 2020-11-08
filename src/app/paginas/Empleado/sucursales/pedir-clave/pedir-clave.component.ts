import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Subsidiary } from 'src/app/shared/models/Subsidiary';

@Component({
  selector: 'app-pedir-clave',
  templateUrl: './pedir-clave.component.html',
  styleUrls: ['./pedir-clave.component.scss'],
})
export class PedirClaveComponent implements OnInit {

  form: FormGroup;
  constructor(private modalCtrl: ModalController, 
    private formBuilder: FormBuilder,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Password: ["",[Validators.required, Validators.maxLength(12), Validators.minLength(6)]]
    })
  }

  enterToSubsidiary(){
    const subsidiaryDbObject: AngularFireObject<Subsidiary> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Sucursal'));
    
    subsidiaryDbObject.valueChanges().subscribe(subsidiaryData=>{
      if(subsidiaryData != null){
        if(this.Password.value == subsidiaryData.Password){
          this.dataSvc.setSubsidiary(this.dataSvc.getSubsidiary());
          this.dataSvc.setEmployeeCode(subsidiaryData.Boss);
          this.router.navigate(['control-inventarios']);
          this.modalCtrl.dismiss();
        }else{
          this.generalSvc.presentToast('customToast', 'Clave incorrecta')
        }
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  get Password(){
    return this.form.get('Password')
  }
}
