import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { EntradaComponent } from './entrada/entrada.component';
import { SalidaComponent } from './salida/salida.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.page.html',
  styleUrls: ['./detalles-producto.page.scss'],
})
export class DetallesProductoPage implements OnInit {

  producto: any = '';
  ref: any;
  constructor(private modalCtrl: ModalController,
    private db:AngularFireDatabase,
    private datos: DatosService) { }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const codigo = this.datos.getCode();
    
    this.ref = this.db.object(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo);
    this.ref.snapshotChanges().subscribe(data=>{
      let product = data.payload.val();
      if(product != null){
        this.producto = product;
        this.datos.setCantAnt(product.Entrada);
      }
    });
  }

  async abrirEntrada()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: EntradaComponent,
    });
    await modal.present();
  }
  async abrirSalida()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: SalidaComponent,
    });
    await modal.present();
  }


}
