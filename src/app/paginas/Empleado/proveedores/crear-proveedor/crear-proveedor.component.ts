import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss'],
})
export class CrearProveedorComponent implements OnInit {

  formulario: FormGroup;
  proveedor: any;
  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private db: AngularFireDatabase, 
    private datos: DatosService,
    private servicio: GeneralService) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Nombre: ["",[Validators.required]],
      Producto: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      Cantidad: ["",[Validators.required]]
    });

    if(this.datos.getOperacion() == 'modificar' && this.datos.getProveedor() != null)
    {
      this.proveedor = this.datos.getProveedor();
      this.formulario.controls.Nombre.setValue(this.proveedor.Nombre);
      this.formulario.controls.Producto.setValue(this.proveedor.Producto);
      this.formulario.controls.Cantidad.setValue(this.proveedor.Cantidad);
    }
  }

  guardarProveedor()
  {
    if(this.formulario.valid)
    {
      const clave = this.datos.getClave();
      this.db.database.ref(clave+'/Proveedores').push({
        Nombre: this.formulario.value.Nombre,
        Producto: this.formulario.value.Producto,
        Cantidad: this.formulario.value.Cantidad
      }).then(()=>{
        this.servicio.mensaje('toastSuccess', 'Proveedor guardado correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.servicio.mensaje('customToast',err);
      })
    }
  }

  modificarProveedor()
  {
    if(this.formulario.valid)
    {
      const clave = this.datos.getClave();
      this.db.database.ref(clave+'/Proveedores/'+this.proveedor.key).set({
        Nombre: this.formulario.value.Nombre,
        Producto: this.formulario.value.Producto,
        Cantidad: this.formulario.value.Cantidad
      }).then(()=>{
        this.servicio.mensaje('toastSuccess', 'Proveedor modificado correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.servicio.mensaje('customToast',err);
      })
    }
  }

  
  goBack()
  {
    this.modalCtrl.dismiss();
  }

  get Nombre(){
    return this.formulario.get('Nombre');
  }

  get Producto(){
    return this.formulario.get('Producto');
  }

  get Cantidad(){
    return this.formulario.get('Cantidad');
  }
}
