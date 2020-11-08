import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss'],
})
export class CambiarPasswordComponent implements OnInit {

  form: FormGroup;
  errorMsg: any;
  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private generalSvc: GeneralService,
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
      (await this.auth.currentUser).updatePassword(this.New.value).then(()=>{
        this.generalSvc.presentToast('toastSuccess', 'Se ha cambiado la contraseña correctamente');
        this.generalSvc.saveDataInLocalStorage('bossPassword', this.New.value);
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.generalSvc.presentToast('customToast', err);
      })
    }
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
