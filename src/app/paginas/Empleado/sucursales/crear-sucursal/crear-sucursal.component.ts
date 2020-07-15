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

  formulario: FormGroup;
  constructor(private modalCtrl: ModalController,
    private datos:DatosService,
    private servicio: GeneralService,
    private formBuilder: FormBuilder,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Nombre: ["",[Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      Password: ["",[Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });
  }

  registrarSucursal()
  {
    if(this.formulario.valid)
    {
      const clave = this.datos.getClave();
      const cedula = this.datos.getCedula();

      this.db.database.ref(clave+'/Sucursales').push({
        Nombre: this.formulario.value.Nombre,
        Jefe: cedula,
        Password: this.formulario.value.Password
      }).then(()=>{
        this.servicio.mensaje('toastSuccess', 'Sucursal registrada correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.servicio.mensaje('customToast', err);
      })
    }
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  get Nombre()
  {
    return this.formulario.get('Nombre');
  }
  
  get Password()
  {
    return this.formulario.get('Password');
  }

}
