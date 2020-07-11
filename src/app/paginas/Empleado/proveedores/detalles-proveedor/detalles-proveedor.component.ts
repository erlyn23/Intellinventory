import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';


@Component({
  selector: 'app-detalles-proveedor',
  templateUrl: './detalles-proveedor.component.html',
  styleUrls: ['./detalles-proveedor.component.scss'],
})
export class DetallesProveedorComponent implements OnInit {
  
  ref: any;
  proveedor: any ='';
  constructor(private modalCtrl: ModalController,
    private db: AngularFireDatabase,
    private datos: DatosService,
  ) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const codigo = this.datos.getCode();

    this.ref = this.db.object(clave+'/Proveedores/'+codigo);
    this.ref.snapshotChanges().subscribe(data=>{
      let provider = data.payload.val();
      if(provider != null){
        this.proveedor = provider;
      }
    })
  }
  goBack(){
    this.modalCtrl.dismiss();
  }

}
