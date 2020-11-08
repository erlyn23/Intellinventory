import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { EntradaComponent } from './entrada/entrada.component';
import { SalidaComponent } from './salida/salida.component';
import { Platform, ModalController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InventarioActualComponent } from './inventario-actual/inventario-actual.component';
import { NotasComponent } from './notas/notas.component';
import { GeneralService } from 'src/app/services/general.service';
import { NotasEntradaComponent } from './notas-entrada/notas-entrada.component';
import { NotasSalidaComponent } from './notas-salida/notas-salida.component';
import { Product } from 'src/app/shared/models/Product';
import { Stock } from 'src/app/shared/models/Stock';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.page.html',
  styleUrls: ['./detalles-producto.page.scss'],
})
export class DetallesProductoPage implements OnInit {

  product: Product;
  angularFireObject: AngularFireObject<Product>;
  isSaved: boolean = false;
  inventoryState: string;
  stock:Stock;
  constructor(private platform: Platform,
    private navCtrl: NavController,
    private router: Router,
    private angularFireDatabase:AngularFireDatabase,
    private dataSvc: DatosService,
    private generalSvc: GeneralService) {
        this.platform.backButton.subscribeWithPriority(10, ()=>{
          this.goBack();
        })
     }

  ngOnInit() {

    this.angularFireObject = this.angularFireDatabase.object(this.generalSvc.getSpecificObjectRoute('Producto'));
    this.angularFireObject.valueChanges().subscribe(dbProduct=>{
      if(dbProduct != null){
        this.product = dbProduct;
        this.product.EntrySum = dbProduct.Entry + dbProduct.InitialCuantity;
        this.product.TotalExistence = dbProduct.EntrySum - dbProduct.Exit;
        this.product.Difference = dbProduct.ActualInventory - dbProduct.TotalExistence;
        this.product.FinalNote = dbProduct.FinalNote;
      }
    });
    this.inventoryState = this.dataSvc.getInventoryState();
    this.setStocks();
  }

  setStocks()
  { 

    const stockDbObject: AngularFireObject<Stock> = this.angularFireDatabase.object(this.generalSvc.getSpecificObjectRoute('Stock'));
    stockDbObject.valueChanges().subscribe(dbStock=>{
      if(dbStock != null)
      {
        this.stock = dbStock;
        this.generalSvc.presentSimpleAlert(`Tenemos información de stock de esta mercancía, 
        se compra por defecto una cantidad de ${this.stock.Cuantity} unidades.`, 'Información');
      }
    });
  }

  openCreateEntry()
  {
    this.generalSvc.openModal(EntradaComponent);
  }

  openCreateExit()
  {
    this.generalSvc.openModal(SalidaComponent);
  }

  openProductEntryNotes()
  {
    this.generalSvc.openModal(NotasEntradaComponent);
  }

  openProductExitNotes()
  {
    this.generalSvc.openModal(NotasSalidaComponent);
  }

  openCreateActualInventory()
  {
    this.generalSvc.openModal(InventarioActualComponent);
  }

  openCreateFinalNote()
  {
    this.generalSvc.openModal(NotasComponent);
  }

  saveChanges()
  {
    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Producto')).update({
      EntrySum: this.product.EntrySum,
      TotalExistence: this.product.TotalExistence,
      Difference: this.product.Difference,
      FinalNote: this.product.FinalNote
    }).then(()=>{
      this.generalSvc.presentToast('toastSuccess','Cambios guardados correctamente');
      this.isSaved = true;
    });
  }

  goBack()
  {
    if(!this.isSaved && this.inventoryState != 'Finalizado')
    {
      this.generalSvc.presentSimpleAlert(`Aún no guardas los cambios, 
      aunque puedas verlos debes guardarlos.`, 'Información');
    }else{
      this.navCtrl.pop().then(()=>{
        this.router.navigate(['administracion']);
      })
    }
  }

}
