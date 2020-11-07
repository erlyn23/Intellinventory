import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';
import { AlertPersonalizadoComponent } from 'src/app/core/alert-personalizado/alert-personalizado.component';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss'],
})
export class EntradaComponent implements OnInit {

  formulario: FormGroup;
  ref: any;
  necesarios: any = {  nombreEmpleado: '', nombreInventario: '', nombreProducto:'', nombreSucursal:''};
  EntradaAnterior: number;
  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
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

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+
    inventario+'/NombreInventario');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreInventario(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+
    inventario+'/Productos/'+producto+'/Nombre');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.necesarios.nombreProducto = nombre;
      this.datos.setNombreProducto(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Nombre');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.necesarios.nombreProducto = nombre;
      this.datos.setNombreSucursal(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+
    inventario+'/Productos/'+producto+'/Entrada');
    this.ref.snapshotChanges().subscribe(data=>{
      let cantidad = data.payload.val();
      this.EntradaAnterior = 0;
      this.EntradaAnterior = cantidad;
    });
  }
  async cargando()
  {
    const alert = this.modalCtrl.create({
      cssClass: 'alertDisfrazado',
      component: AlertPersonalizadoComponent,
      id: 'sirvedealert'
    });
    (await alert).present();
  }

  darEntradaProducto()
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

        this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+
        llaveInventario+'/Productos/'+codigo).update({
          Entrada: this.EntradaAnterior + this.formulario.value.Cantidad
          }).then(()=>{
            this.servicio.mensaje('toastSuccess','Entrada hecha correctamente');
            this.db.database.ref(claveBar+'/ParaNotificaciones/Entradas').push({
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
            const cadenaFecha =  `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}`;
            this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+
            llaveInventario+'/Productos/'+codigo+'/NotasEntrada').push({
              Nota: this.formulario.value.Nota,
              Cantidad: this.formulario.value.Cantidad,
              Fecha: cadenaFecha
            })
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
