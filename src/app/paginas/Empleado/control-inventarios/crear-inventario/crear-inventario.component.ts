import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-inventario',
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.scss'],
})
export class CrearInventarioComponent implements OnInit {

  form: FormGroup;
  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private db: AngularFireDatabase,
    private general: GeneralService,
    private datos: DatosService) { }

  ngOnInit() {
    const fecha = new Date();
    this.form = this.formBuilder.group({
      Nombre: ["",[Validators.required]],
      Fecha: [`${fecha.getDate()}/${(fecha.getMonth() + 1)}/${fecha.getFullYear()}`]
    })
  }

  crearInventario()
  {
    this.db.database.ref(this.datos.getClave()+'/Inventarios/'+this.datos.getCedula()).push({
      NombreInventario: this.form.value.Nombre,
      FechaInventario: this.form.value.Fecha
    }).then(()=>{
      this.general.mensaje('toastSuccess','Se ha creado el inventario');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.general.mensaje('customToast', err);
    })
  }

}
