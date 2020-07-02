import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  form: FormGroup;
  ref: any;
  constructor(private menuCtrl: MenuController, 
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.form = this.formBuilder.group({
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Edad: ["",[Validators.required]],
      Telefono: ["",[Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      Correo: ["", [Validators.email]]
    });
    this.ref = this.db.object(clave+'/Empleados/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let datos = data.payload.val();
      this.form.controls.Nombre.setValue(datos.Nombre);
      this.form.controls.Edad.setValue(datos.Edad);
      this.form.controls.Telefono.setValue(datos.Telefono);
      this.form.controls.Correo.setValue(datos.Correo);
    });
  }


  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  get Nombre(){
    return this.form.get('Nombre');
  }

  get Edad(){
    return this.form.get('Edad');
  }

  get Telefono(){
    return this.form.get('Telefono');
  }
  
  get Correo(){
    return this.form.get('Correo');
  }

}
