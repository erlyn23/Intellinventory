import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';


const PASSWORD_CHANGED = 'Se ha cambiado la contraseña correctamente';
const SUCCESS_CLASS = 'toastSuccess';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss'],
})
export class CambiarPasswordComponent implements OnInit {

  @Input() isEmployee: boolean;
  form: FormGroup;
  errorMsg: any;
  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private generalSvc: GeneralService,
    private angularFireDb: AngularFireDatabase,
    private auth: AngularFireAuth) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      New: ["",[Validators.required, Validators.maxLength(16), Validators.minLength(8)]],
      Repeat: ["",[Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
    });
  }

  verifyIfPasswordsMatch(val: any)
  {
    let newPasswordRepeat = val.detail.value;
    let newPassword = this.New.value;

    if(newPasswordRepeat != newPassword)
    {
      this.errorMsg = "Las contraseñas no coinciden";
    }else{
      this.errorMsg = "";
    }
  }

  async changePassword()
  {
    if(this.form.valid)
    {
      if(!this.isEmployee)
        await this.changeBossPassword();
      else
        this.changeEmployeePassword();
    }
  }

  async changeBossPassword(){
    (await this.auth.currentUser).updatePassword(this.New.value).then(()=>{
      this.successChangedPassword();
    }).catch(err=>{
      this.generalSvc.presentToast('customToast', err);
    });
  }

  changeEmployeePassword(){
    this.angularFireDb.database.ref(this.generalSvc.getSpecificObjectRoute("Empleado")).update({
      Password: this.New.value
    }).then(()=>{
      this.successChangedPassword();
    });
  }

  successChangedPassword(){
    this.generalSvc.presentToast(SUCCESS_CLASS, PASSWORD_CHANGED);
    const storageKey = (this.isEmployee) ? 'employeePassword' : 'bossPassword'; 
    this.generalSvc.saveDataInLocalStorage(storageKey, this.New.value);
    this.modalCtrl.dismiss();
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

  get New(){
    return this.form.get('New');
  }

  get Repeat(){
    return this.form.get('Repeat');
  }
}
