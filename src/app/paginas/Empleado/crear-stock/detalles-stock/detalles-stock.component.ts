import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { Stock } from 'src/app/shared/models/Stock';

@Component({
  selector: 'app-detalles-stock',
  templateUrl: './detalles-stock.component.html',
  styleUrls: ['./detalles-stock.component.scss'],
})
export class DetallesStockComponent implements OnInit {

  stock: Stock;
  constructor(private modalCtrl: ModalController,
    private angularFireDatabase: AngularFireDatabase,
    private generalSvc: GeneralService
  ) { }

  ngOnInit() {
    const stockDbObject: AngularFireObject<Stock> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Stock'));
    
    stockDbObject.valueChanges().subscribe(stockData=>{
      if(stockData != null){
        this.stock = stockData;
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
