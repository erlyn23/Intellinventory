import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-detalles-stock',
  templateUrl: './detalles-stock.component.html',
  styleUrls: ['./detalles-stock.component.scss'],
})
export class DetallesStockComponent implements OnInit {

  ref: any;
  producto: any ='';
  constructor(private modalCtrl: ModalController,
    private db: AngularFireDatabase,
    private datos: DatosService,
  ) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const codigo = this.datos.getCode();

    this.ref = this.db.object(clave+'/Stock/'+cedula+'/'+codigo);
    this.ref.snapshotChanges().subscribe(data=>{
      let product = data.payload.val();
      if(product != null){
        this.producto = product;
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
