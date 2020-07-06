import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss'],
})
export class NotasComponent implements OnInit {

  formulario: FormGroup;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Nota: ["",[Validators.required]],
    });
  }

  guardarNota()
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
      Nota: this.formulario.value.Nota,
    }).then(()=>{
      this.servicio.mensaje('toastSuccess','Nota guardada correctamente');
      this.modalCtrl.dismiss();
    }).catch((err)=>{
    this.servicio.mensaje('customToast',err);
    });
    //Proceso completo para guardar artículo en la BD
  }

}