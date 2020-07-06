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
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Cantidad: ["",[Validators.required]],
    });
  }
  
  async getJefe(llave:any)
  {
    return (await Storage.get(llave));
  }

  SalidaProducto()
  {
    if(this.formulario.valid)
    {
      //Variables que almacenan los datos necesarios para operar en la BD.
        const claveBar = this.datos.getClave();
        const cedula = this.datos.getCedula();
        const llaveInventario = this.datos.getKey();
        const codigo = this.datos.getCode();
      //Variables que almacenan los datos necesarios para operar en la BD.{
        //Proceso completo para guardar artículo en la BD
        this.db.database.ref(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo).update(
        {
          Salida: this.formulario.value.Cantidad,
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

  goBack()
  {
    this.modalCtrl.dismiss();
  }
}
