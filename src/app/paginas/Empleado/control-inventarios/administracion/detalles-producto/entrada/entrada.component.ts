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
  necesarios: any = {  nombreEmpleado: '', nombreInventario: '', nombreProducto:'', nombreSucursal:''}
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

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/NombreInventario');
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreInventario(nombre);
    });

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto+'/Nombre');
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

  EntradaProducto()
  {
    if(this.formulario.valid)
    {
      this.necesarios.nombreEmpleado = this.datos.getNombreEmpleado();
      this.necesarios.nombreInventario = this.datos.getNombreInventario();
      this.necesarios.nombreProducto = this.datos.getNombreProducto();
      this.necesarios.nombreSucursal = this.datos.getNombresucursal();
      //Variables que almacenan los datos necesarios para operar en la BD.
        const claveBar = this.datos.getClave();
        const sucursal = this.datos.getSucursal();
        const cedula = this.datos.getCedula();
        const llaveInventario = this.datos.getKey();
        const codigo = this.datos.getCode();
      //Variables que almacenan los datos necesarios para operar en la BD.

      //Proceso completo para guardar artículo en la BD
        this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo).update({
          Entrada: this.formulario.value.Cantidad
          }).then(()=>{
            this.servicio.mensaje('toastSuccess','Entrada hecha correctamente');
            this.db.database.ref(claveBar+'/ParaNotificaciones/Entradas').push({
              NombreEmpleado: this.necesarios.nombreEmpleado,
              NombreInventario: this.necesarios.nombreInventario,
              NombreProducto: this.necesarios.nombreProducto,
              NombreSucursal: this.necesarios.nombreSucursal,
            });
            this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo+'/NotasEntrada').push({
              Nota: this.formulario.value.Nota
            })
            this.modalCtrl.dismiss();
        }).catch((err)=>{
        this.servicio.mensaje('customToast',err);
        });
      //Proceso completo para guardar artículo en la BD
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

}
