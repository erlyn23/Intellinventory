import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-modal-crear',
  templateUrl: './modal-crear.component.html',
  styleUrls: ['./modal-crear.component.scss'],
})
export class ModalCrearComponent implements OnInit {

  formulario: FormGroup;
  constructor(private db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private servicio: GeneralService,
    private datos: DatosService) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Cedula: ["",[Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*')]],
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    })
  }

  guardarEmpleado(){
    const nombre = this.formulario.value.Nombre;
    const cedula = this.formulario.value.Cedula;
    this.db.database.ref('EmpleadosActivos/'+cedula).set({
      CodigoActivacion: this.datos.getClave(),
    });
    this.db.database.ref(this.datos.getClave()+'/Empleados/'+cedula).set({
      Nombre: nombre,
      Cedula: cedula
    }).then(()=>{
      this.servicio.mensaje('toastSuccess', 'El empleado se ha guardado correctamente');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.servicio.mensaje('customToast',err);
    });
  }

  close(){
    this.modalCtrl.dismiss();
  }
  get Cedula(){
    return this.formulario.get('Cedula');
  }

  get Nombre(){
    return this.formulario.get('Nombre');
  }
}
