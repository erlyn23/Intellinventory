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

  formulario: FormGroup;
  ref: any;
  constructor(private modalCtrl: ModalController,
    private constructorFormulario: FormBuilder,
    private db: AngularFireDatabase,
    private general: GeneralService,
    private datos: DatosService) { }

  ngOnInit() {
    const fecha = new Date();

    this.formulario = this.constructorFormulario.group({
      Nombre: ["",[Validators.required, Validators.maxLength(30)]],
      Fecha: [`${fecha.getDate()}/${(fecha.getMonth() + 1)}/${fecha.getFullYear()}`],
    })
  }

  crearInventario()
  {
    const clave = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();

    this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula).push({
      NombreInventario: this.formulario.value.Nombre,
      FechaInventario: this.formulario.value.Fecha,
      Estado: 'En progreso'
    }).then(()=>{
      this.general.mensaje('toastSuccess','Se ha creado el inventario');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.general.mensaje('customToast', err);
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  get Nombre()
  {
    return this.formulario.get('Nombre');
  }
}
