import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { StockModalComponent } from './stock-modal/stock-modal.component';
import { DetallesStockComponent } from './detalles-stock/detalles-stock.component';
import { Router } from '@angular/router';
import { Stock } from 'src/app/shared/models/Stock';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-crear-stock',
  templateUrl: './crear-stock.page.html',
  styleUrls: ['./crear-stock.page.scss'],
})
export class CrearStockPage implements OnInit {

  stocks: Stock[] = [];
  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private generalSvc: GeneralService,
    private dataSvc: DatosService,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router) {
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard']);
      })
     }

  ngOnInit() {
    this.getStocksList();
  }

  getStocksList(){
    const stocksDbObject: AngularFireObject<Stock> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Stocks'));
    
    stocksDbObject.snapshotChanges().subscribe(stockData=>{
      let stocks = stockData.payload.val();
      this.stocks = [];
      for(let i in stocks)
      {
        stocks[i].Key = i;
        this.stocks.push(stocks[i]);
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  openCreateStockModal()
  {
    this.generalSvc.openModal(StockModalComponent);
  }
  
  goToDetails(i:number){
    this.dataSvc.setProductCode(this.stocks[i].Key);
    this.generalSvc.openModal(DetallesStockComponent);
  }

  confirmDeleteStock(stockIndex: number)
  {
    this.generalSvc.presentAlertWithActions('Confirmar', '¿Estás seguro de eliminar este stock? No podrás recuperarlo',
    ()=>{this.deleteStock(stockIndex)}, ()=>{ this.generalSvc.closeAlert(); });
  }

  deleteStock(stockIndex: number)
  {
    this.angularFireDatabase.database.ref(`${this.generalSvc.getSpecificObjectRoute('Stocks')}/${this.stocks[stockIndex].Key}`)
    .remove().then(()=>{
      this.generalSvc.presentToast('toastSuccess', 'Stock eliminado correctamente');
    }).catch(err=>{
      this.generalSvc.presentToast('customToast',err);
    });
  }
}
