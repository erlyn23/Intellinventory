import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventario-actual',
  templateUrl: './inventario-actual.component.html',
  styleUrls: ['./inventario-actual.component.scss'],
})
export class InventarioActualComponent implements OnInit {

  formulario: FormGroup;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Cantidad: ["",[Validators.required]],
    });
  }

  regInventarioActual()
  {
    //Variables que almacenan los datos necesarios para operar en la BD.
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const codigo = this.datos.getCode();
    //Variables que almacenan los datos necesarios para operar en la BD.{
    //Proceso completo para guardar artículo en la BD
    this.db.database.ref(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo).update(
    {
      InventarioActual: this.formulario.value.Cantidad,
    }).then(()=>{
      this.servicio.mensaje('toastSuccess','Datos actualizados correctamente');
      this.modalCtrl.dismiss();
    }).catch((err)=>{
    this.servicio.mensaje('customToast',err);
    });
  //Proceso completo para guardar artículo en la BD
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }
}