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
  ref: any;
  fechaSalida: any;
  cantidadAnterior:number = 0;
  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Codigo: ["",[Validators.required]],
      Cantidad: ["",[Validators.required]],
    });
    this.cantidadAnterior = this.datos.getCantAnt();
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

  EntradaProducto()
  {
    if(this.formulario.valid)
    {
      //Variables que almacenan los datos necesarios para operar en la BD.
        const claveBar = this.datos.getClave();
        const cedula = this.datos.getCedula();
        const llaveInventario = this.datos.getKey();
      //Variables que almacenan los datos necesarios para operar en la BD.

      //Proceso completo para guardar artículo en la BD
        this.db.database.ref(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+this.formulario.value.Codigo).update({
          Entrada: this.formulario.value.Cantidad + this.cantidadAnterior,
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
      //Proceso completo para guardar artículo en la BD
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

}
