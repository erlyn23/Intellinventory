import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
})
export class CrearProductoComponent implements OnInit {

  form: FormGroup;
  constructor(private modalCtrl: ModalController, private datos: DatosService,
    private servicio: GeneralService,
    private formBuilder: FormBuilder,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Codigo: ["",[Validators.required]],
      Nombre: ["",[Validators.required, Validators.maxLength(30)]],
      CantidadInicial: ["",[Validators.required]]
    })
  }

  crearProducto(){
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

    if(this.form.valid){
      this.servicio.insertarenlaBD(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+this.form.value.Codigo,
      {
        Codigo: this.form.value.Codigo,
        Nombre: this.form.value.Nombre,
        CantidadInicial: this.form.value.CantidadInicial
      }).then(()=>{
        this.servicio.mensaje('toastSuccess','Se ha creado el producto correctamente');
        this.modalCtrl.dismiss();
      })
    }
  }
}
