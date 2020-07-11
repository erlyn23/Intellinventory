import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { StockModalComponent } from './stock-modal/stock-modal.component';
import { DetallesStockComponent } from './detalles-stock/detalles-stock.component';

@Component({
  selector: 'app-crear-stock',
  templateUrl: './crear-stock.page.html',
  styleUrls: ['./crear-stock.page.scss'],
})
export class CrearStockPage implements OnInit {

  ref: any;
  stocks: any[] = [];
  constructor(private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos: DatosService,
    private general: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.obtenerStocks();
  }

  obtenerStocks(){
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.ref = this.db.object(clave+'/Stock/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let defaults = data.payload.val();
      this.stocks = [];
      for(let i in defaults)
      {
        defaults[i].key = i;
        this.stocks.push(defaults[i]);
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  async abrirModalStock()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: StockModalComponent
    });
    (await modal).present();
  }

  async eliminarStock(i: number)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este stock? No podrás recuperarlo',
      buttons:[
        {
          cssClass:'CancelarEliminar',
          role:'cancel',
          text:'Cancelar',
          handler: ()=>{
            this.alertCtrl.dismiss();
          }
        },
        {
          cssClass:'ConfirmarEliminar',
          role:"confirm",
          text: 'Confirmar',
          handler: ()=>{
            const clave = this.datos.getClave();
            const cedula = this.datos.getCedula();

            this.db.database.ref(clave+'/Stock/'+cedula+'/'+this.stocks[i].key).remove().then(()=>{
              this.general.mensaje('toastSuccess', 'Stock eliminado correctamente');
            }).catch(err=>{
              this.general.mensaje('customToast',err);
            })
          }
        }
      ]
    });
    (await alert).present();
  }

  async goToDetails(i:number){
    this.datos.setCode(this.stocks[i].key);
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: DetallesStockComponent
    });
    (await modal).present();
  }

}
