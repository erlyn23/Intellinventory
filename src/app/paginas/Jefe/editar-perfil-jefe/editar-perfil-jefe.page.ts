import { Component, OnInit } from '@angular/core';
import { MenuController, PopoverController, ModalController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FotoPopoverComponent } from './../../../core/foto-popover/foto-popover.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Boss } from 'src/app/shared/models/Boss';

@Component({
  selector: 'app-editar-perfil-jefe',
  templateUrl: './editar-perfil-jefe.page.html',
  styleUrls: ['./editar-perfil-jefe.page.scss'],
})
export class EditarPerfilJefePage implements OnInit {

  form: FormGroup;
  bossProfileUrlImage: string = "";
  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private router:Router,
    private popoverCtrl: PopoverController, 
    private formBuilder: FormBuilder,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase,
    private angularFireStorage: AngularFireStorage) {
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard-jefe']);
      })
     }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Name: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      PhoneNumber: ["",[Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      Company: [""]
    });
    
    const bossDbObject: AngularFireObject<Boss> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Jefe'));
    
    bossDbObject.valueChanges().subscribe(bossData=>{
      if(bossData != null)
      {
        this.Name.setValue(bossData.Name);
        this.PhoneNumber.setValue(bossData.PhoneNumer);
        this.Company.setValue(bossData.CompanyName);

        const bossProfilePhotoDirectory = this.angularFireStorage.ref(bossData.Photo);

        bossProfilePhotoDirectory.getDownloadURL().subscribe(bossProfilePhotoUrl=>{
          this.bossProfileUrlImage = bossProfilePhotoUrl;
        })
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  async openChangeProfilePhotoPopover()
  {
    const popover = await this.popoverCtrl.create({
      cssClass: 'customPopover',
      component: FotoPopoverComponent,
      translucent: true,
    });
    return (await popover.present());
  }

  openChangePasswordModal()
  {
    this.generalSvc.openModal(CambiarPasswordComponent);
  }

  saveProfileData()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Jefe')).update({
        Name: this.Name.value,
        PhoneNumber: this.PhoneNumber.value,
        CompanyName: this.Company.value
      }).then(()=>{
        this.generalSvc.presentToast('toastSuccess', 'Cambios guardados correctamente');
      }).catch(err=>{
        this.generalSvc.presentToast('customToast',err);
      });
    }
  }

  get Name(){
    return this.form.get('Name');
  }

  get PhoneNumber(){
    return this.form.get('PhoneNumber');
  }
  
  get Company(){
    return this.form.get('Company');
  }

}
