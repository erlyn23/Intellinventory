import { Component, OnInit } from '@angular/core';
import { PopoverController, MenuController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FotoPopoverComponent } from './../../../core/foto-popover/foto-popover.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  form: FormGroup;
  employeeProfilePhoto: string = "";
  constructor(private menuCtrl: MenuController,
    private router: Router,
    private platform: Platform,
    private popoverCtrl: PopoverController, 
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase,
    private angularFireStorage: AngularFireStorage) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard']);
      })
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Name: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Age: ["",[Validators.required]],
      PhoneNumber: ["",[Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      Email: ["", [Validators.email]]
    });
    
    const employeeDbObject: AngularFireObject<Employee> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Empleado'));
    
    employeeDbObject.valueChanges().subscribe(employeeData=>{
      this.Name.setValue(employeeData.Name);
      this.Age.setValue(employeeData.Age);
      this.PhoneNumber.setValue(employeeData.PhoneNumber);
      this.Email.setValue(employeeData.Email);

      const profileEmployeePhotoDirectory = this.angularFireStorage.ref(employeeData.Photo);

      profileEmployeePhotoDirectory.getDownloadURL().subscribe(profilePhotoUrl=>{
        this.employeeProfilePhoto = profilePhotoUrl;
      })
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
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


  saveEmployeeProfileInfo()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Empleado')).update({
        Name: this.Name.value,
        Age: this.Age.value,
        PhoneNumber: this.PhoneNumber.value,
        Email: this.Email.value
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

  get Age(){
    return this.form.get('Age');
  }

  get PhoneNumber(){
    return this.form.get('PhoneNumber');
  }
  
  get Email(){
    return this.form.get('Email');
  }

}
