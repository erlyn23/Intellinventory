import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/Producto';
import { ModalController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-salida',
  templateUrl: './salida.component.html',
  styleUrls: ['./salida.component.scss'],
})
export class SalidaComponent implements OnInit {

  formulario: FormGroup;
  producto: Producto;
  cantidadAnterior: any;
  fechaEntrada: any;
  ref: any;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
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
      fechaSalida: [`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`,[Validators.required]],
      Descripcion:[""]
    })
  }
  
  async getJefe(llave:any)
  {
    return (await Storage.get(llave));
  }

  async aviso(mensaje: any)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'alertAdvertencia',
      header: 'Advertencia',
      message: mensaje,
      buttons:
      [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: ()=>{
            this.alertCtrl.dismiss();
          }
        }  
      ]
    });
    await alert.present();
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
          this.fechaEntrada = articulo.FechaEntrada;
        }else{
          let fecha = new Date();
          this.formulario.controls.Nombre.setValue("");
          this.formulario.controls.Cantidad.setValue("");
          this.formulario.controls.Precio.setValue("");
          this.formulario.controls.fechaSalida.setValue(`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`);
          this.formulario.controls.Descripcion.setValue("");
        }
      });
    //Proceso para obtener artículo de la BD y luego modificar su cantidad si se le dan más entradas.
  }

  SalidaProducto()
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

      if(this.producto.Cantidad > this.cantidadAnterior)
      {
        this.aviso('La cantidad debe ser menor a la existente')
      }/* else if(this.cantidadAnterior <= 20){
        this.aviso('Se está agotando la existencia, le recomendamos rellenar el inventario');
      } */else{
        //Proceso completo para guardar artículo en la BD
        this.db.database.ref(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+this.producto.Codigo)
        .set({
        Nombre: this.producto.Nombre,
        Codigo: this.producto.Codigo,
        Cantidad: this.cantidadAnterior-this.producto.Cantidad,
        Precio: this.producto.Precio,
        FechaEntrada: this.fechaEntrada,
        FechaSalida: this.producto.fechaSalida,
        Descripcion: this.producto.Descripcion
        }).then(()=>{
        this.servicio.mensaje('toastSuccess','Salida hecha correctamente');
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
      //Proceso completo para guardar artículo en la BD
      }
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

}
