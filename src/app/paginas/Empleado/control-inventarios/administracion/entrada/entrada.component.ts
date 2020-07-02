import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Producto } from 'src/app/models/Producto';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AlertPersonalizadoComponent } from 'src/app/core/alert-personalizado/alert-personalizado.component';

const { Storage } = Plugins;
@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss'],
})
export class EntradaComponent implements OnInit {

  formulario: FormGroup;
  producto: Producto;
  ref: any;
  fechaSalida: any;
  cantidadAnterior:number = 0;
  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    let fecha = new Date();
    this.formulario = this.formBuilder.group({
      Nombre: ["",[Validators.required]],
      Codigo: ["",[Validators.required]],
      Cantidad: ["",[Validators.required]],
      Precio: ["",[Validators.required]],
      fechaEntrada: [`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`,[Validators.required]],
      Descripcion:[""]
    })
  }

  async getJefe(llave:any)
  {
    return (await Storage.get(llave));
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

  getProducto(val: any)
  {
    this.producto = new Producto();
    //Variables que almacenan los datos necesarios para operar en la BD.
      const claveBar = this.datos.getClave();
      const cedula = this.datos.getCedula();
      const llaveInventario = this.datos.getKey();
    //Variables que almacenan los datos necesarios para operar en la BD.
    //Proceso para obtener artículo de la BD y luego modificar su cantidad si se le dan más entradas.
      this.ref = this.db.object(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+val.detail.value);
      this.ref.snapshotChanges().subscribe(data=>{
        let articulo = data.payload.val();
        if(articulo != null)
        {
          this.formulario.controls.Nombre.setValue(articulo.Nombre);
          this.formulario.controls.Cantidad.setValue(articulo.Cantidad);
          this.formulario.controls.Precio.setValue(articulo.Precio);
          this.formulario.controls.Descripcion.setValue(articulo.Descripcion);
          this.cantidadAnterior = articulo.Cantidad;
          this.fechaSalida = articulo.FechaSalida;
        }else{
          let fecha = new Date();
          this.formulario.controls.Nombre.setValue("");
          this.formulario.controls.Cantidad.setValue("");
          this.formulario.controls.Precio.setValue("");
          this.formulario.controls.fechaEntrada.setValue(`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`);
          this.formulario.controls.Descripcion.setValue("");
        }
      });
    //Proceso para obtener artículo de la BD y luego modificar su cantidad si se le dan más entradas.
  }

  EntradaProducto()
  {
    if(this.formulario.valid)
    {
      this.producto = new Producto();
      this.producto = this.formulario.value;
      //Variables que almacenan los datos necesarios para operar en la BD.
        const claveBar = this.datos.getClave();
        const cedula = this.datos.getCedula();
        const llaveInventario = this.datos.getKey();
      //Variables que almacenan los datos necesarios para operar en la BD.

      //Proceso completo para guardar artículo en la BD
        this.servicio.insertarenlaBD(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+this.producto.Codigo, 
          {
          Nombre: this.producto.Nombre,
          Codigo: this.producto.Codigo,
          Cantidad: this.producto.Cantidad + this.cantidadAnterior,
          Precio: this.producto.Precio,
          FechaEntrada: this.producto.fechaEntrada,
          FechaSalida: "",
          Descripcion: this.producto.Descripcion
          }).then(()=>{
            this.servicio.mensaje('toastSuccess','Entrada hecha correctamente');
            this.modalCtrl.dismiss();
            this.getJefe('posicion').then(data=>{
              if(data.value == 'jefe')
              {
                //Aquí va el código de las notificaciones.
              }
            });
        }).catch((err)=>{
        this.servicio.mensaje('customToast',err);
        });
      //Proceso completo para guardar artículo en la BD*/
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

}
