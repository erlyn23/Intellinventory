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
  ref: any;
  sucursales: any[] = [];
  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private db: AngularFireDatabase,
    private general: GeneralService,
    private datos: DatosService) { }

  ngOnInit() {
    const fecha = new Date();
    const clave = this.datos.getClave();

    this.form = this.formBuilder.group({
      Nombre: ["",[Validators.required, Validators.maxLength(30)]],
      Fecha: [`${fecha.getDate()}/${(fecha.getMonth() + 1)}/${fecha.getFullYear()}`],
      Sucursal: ["",[Validators.required]]
    })
    
    this.ref = this.db.object(clave+'/Sucursales/');
    this.ref.snapshotChanges().subscribe(data=>{
      let locales = data.payload.val();
      this.sucursales = [];
      for(let i in locales)
      {
        locales[i].key = i;
        this.sucursales.push(locales[i]);
      }
    })
  }

  crearInventario()
  {
    this.db.database.ref(this.datos.getClave()+'/Sucursales/'+this.form.value.Sucursal+'/Inventarios/'+this.datos.getCedula()).push({
      NombreInventario: this.form.value.Nombre,
      FechaInventario: this.form.value.Fecha,
      Estado: 'En progreso'
    }).then(()=>{
      this.general.mensaje('toastSuccess','Se ha creado el inventario');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.general.mensaje('customToast', err);
    })
  }

  get Nombre()
  {
    return this.form.get('Nombre');
  }

  get Sucursal(){
    return this.form.get('Sucursal');
  }
}
