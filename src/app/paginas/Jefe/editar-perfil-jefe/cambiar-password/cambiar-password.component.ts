import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

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
    private servicio: GeneralService,
    private auth: AngularFireAuth) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Nueva: ["",[Validators.required, Validators.maxLength(16), Validators.minLength(8)]],
      Repetir: ["",[Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
    });
  }

  verificarSemejanza(val: any)
  {
    let pss = val.detail.value;
    let otrapss = this.form.value.Nueva;

    if(pss != otrapss)
    {
      this.errorMsg = "Las contraseñas no coinciden";
    }else{
      this.errorMsg = "";
    }
  }
  async guardarUsuario(llave: any, valor: any)
  {
    await Storage.set({key: llave, value: valor});
  }

  async cambiarClave()
  {
    if(this.form.valid)
    {
      (await this.auth.currentUser).updatePassword(this.form.value.Nueva).then(()=>{
        this.servicio.mensaje('toastSuccess', 'Se ha cambiado la contraseña correctamente');
        this.guardarUsuario('password', this.form.value.Nueva);
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.servicio.mensaje('customToast', err);
      })
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

  get Nueva(){
    return this.form.get('Nueva');
  }

  get Repetir(){
    return this.form.get('Repetir');
  }
}
