import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { NavController, ModalController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { NotasEntradaComponent } from 'src/app/paginas/Empleado/control-inventarios/administracion/detalles-producto/notas-entrada/notas-entrada.component';
import { NotasSalidaComponent } from 'src/app/paginas/Empleado/control-inventarios/administracion/detalles-producto/notas-salida/notas-salida.component';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.page.html',
  styleUrls: ['./detalles-producto.page.scss'],
})
export class DetallesProductoPage implements OnInit {

  product: Product;
  inventoryState: string;
  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private router: Router,
    private angularFireDatabase:AngularFireDatabase,
    private generalSvc: GeneralService,
    private dataSvc: DatosService) {
     }

  ngOnInit() {
    this.inventoryState = this.dataSvc.getInventoryState();
    const productDbObject: AngularFireObject<Product> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Producto'));
    
    productDbObject.valueChanges().subscribe(productData=>{
      if(productData != null){
        this.product = productData;
        this.product.EntrySum = productData.Entry + productData.InitialCuantity;
        this.product.TotalExistence = productData.EntrySum - productData.Exit;
        this.product.Difference = productData.ActualInventory - productData.TotalExistence;
        this.product.FinalNote = productData.FinalNote;
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'second');
  }

  async openEntryNotesModal()
  {
    const modal = await this.modalCtrl.create({
      component: NotasEntradaComponent,
    });
    await modal.present();
  }

  async openExitNotesModal()
  {
    const modal = await this.modalCtrl.create({
      component: NotasSalidaComponent,
    });
    await modal.present();
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
        this.router.navigate(['administracion-jefe']);
      })
  }
}
