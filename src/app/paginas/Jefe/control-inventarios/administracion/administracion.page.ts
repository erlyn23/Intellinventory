import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Inventory } from 'src/app/shared/models/Inventory';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {

  inventory: Inventory = {
    Key: '',
    Name: '',
    CreationDate: '',
    State: '',
    Products: null
  };
  products: Product[] = [];
  searchResultProducts: Product[];
  isSearch: boolean = false;
  constructor(private navCtrl: NavController, 
    private platform: Platform,
    private menuCtrl: MenuController,
    private dataSvc:DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.goBack();
      })
    }

  ngOnInit() {

    const inventoryDbObject: AngularFireObject<Inventory> = this.angularFireDatabase.object(this.generalSvc.getSpecificObjectRoute('Inventario'));
    inventoryDbObject.valueChanges().subscribe(inventoryData=>{
      if(inventoryData != null){
        this.inventory = inventoryData
        this.dataSvc.setInventoryState(this.inventory.State);
      }
    });

    const productsDbObject: AngularFireObject<Product> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Productos'));
   
    productsDbObject.snapshotChanges().subscribe(productData=>{
      let dbProducts = productData.payload.val();
      this.products = [];
      for(let i in dbProducts)
      {
        dbProducts[i].Code = i;
        this.products.push(dbProducts[i]);
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'second');
  }

  searchProducts(val:any)
  {
    this.isSearch = true;
    const productsDbObject: AngularFireObject<Product> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Productos'));

    productsDbObject.snapshotChanges().subscribe(productsData=>{
      let dbProducts = productsData.payload.val();
      this.searchResultProducts = [];
      for(let i in dbProducts)
      {
        if(dbProducts[i].Name.includes(val.detail.value))
        {
          this.searchResultProducts.push(dbProducts[i]);
        }
        else if(val.detail.value == "")
        {
          this.isSearch = false;
        }
      }
    });
  }

  goToDetails(i:number)
  {
    if(this.searchResultProducts != null)
    {
      this.dataSvc.setInventoryState(this.inventory.State);
      this.dataSvc.setProductCode(this.searchResultProducts[i].Code);
      this.router.navigate(['detalles-producto-jefe']);
    }else{
      this.dataSvc.setInventoryState(this.inventory.State);
      this.dataSvc.setProductCode(this.products[i].Code);
      this.router.navigate(['detalles-producto-jefe'])
    } 
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
      this.router.navigate(['control-inventarios-jefe']);
    });
  }
}
