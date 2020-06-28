import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-crear-inventario',
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.scss'],
})
export class CrearInventarioComponent implements OnInit {

  inventario:any = {nombre:''};
  constructor(private modalCtrl: ModalController,
    private db: AngularFireDatabase,
    private general: GeneralService,
    private datos: DatosService) { }

  ngOnInit() {}

  crearInventario()
  {
    this.db.database.ref(this.datos.getClave()+'/Inventarios/'+this.datos.getCedula()).push({
      NombreInventario: this.inventario.nombre
    }).then(()=>{
      this.general.mensaje('toastSuccess','Se ha creado el inventario');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.general.mensaje('customToast', err);
    })
  }

}
