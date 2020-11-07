import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
@Component({
  selector: 'app-salida',
  templateUrl: './salida.component.html',
  styleUrls: ['./salida.component.scss'],
})
export class SalidaComponent implements OnInit {

  formulario: FormGroup;
  ref: any;
  necesarios: any = {  nombreEmpleado: '', nombreInventario: '', nombreProducto:'', nombreSucursal: ''};
  SalidaAnterior: number = 0;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {

    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const sucursal = this.datos.getSucursal();
    const inventario = this.datos.getKey();
    const producto = this.datos.getCode();

    this.formulario = this.formBuilder.group({
      Cantidad: ["",[Validators.required]],
      Nota: ["",[Validators.required]]
    });

    this.ref = this.db.object(clave+'/Empleados/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreEmpleado(nombre.Nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/NombreInventario');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreInventario(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto+'/Nombre');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreProducto(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Nombre');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreSucursal(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto+'/Salida');
    this.ref.snapshotChanges().subscribe(data=>{
      let cantidad = data.payload.val();
      this.SalidaAnterior = 0;
      this.SalidaAnterior = cantidad;
    });
  }
  
  SalidaProducto()
  {
    if(this.formulario.valid)
    {
        this.necesarios.nombreEmpleado = this.datos.getNombreEmpleado();
        this.necesarios.nombreInventario = this.datos.getNombreInventario();
        this.necesarios.nombreProducto = this.datos.getNombreProducto();
        this.necesarios.nombreSucursal = this.datos.getNombresucursal();
        const claveBar = this.datos.getClave();
        const sucursal = this.datos.getSucursal();
        const cedula = this.datos.getCedula();
        const llaveInventario = this.datos.getKey();
        const codigo = this.datos.getCode();
        this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo).update(
        {
          Salida: this.SalidaAnterior + this.formulario.value.Cantidad,
        }).then(()=>{
          this.servicio.mensaje('toastSuccess','Salida hecha correctamente');
          this.db.database.ref(claveBar+'/ParaNotificaciones/Salidas').push({
            NombreEmpleado: this.necesarios.nombreEmpleado,
            NombreInventario: this.necesarios.nombreInventario,
            NombreProducto: this.necesarios.nombreProducto,
            NombreSucursal: this.necesarios.nombreSucursal,
            ClaveBar: claveBar,
            Sucursal: sucursal,
            Inventario: llaveInventario,
            Cedula: cedula,
            Producto: codigo
          });
          const fecha = new Date();
          const fechaConFormato = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha.getHours()}: ${fecha.getMinutes()}`;
          this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo+'/NotasSalidas').push({
            NotaSalida: this.formulario.value.Nota,
            Cantidad: this.formulario.value.Cantidad,
            Fecha: fechaConFormato
          });
          this.modalCtrl.dismiss();
        }).catch((err)=>{
        this.servicio.mensaje('customToast',err);
        });
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }
}
