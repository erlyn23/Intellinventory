import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { ImportarProductosComponent } from './importar-productos/importar-productos.component';
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
    Products: null,
    State: ''
  };
  products: Product[] = [];
  searchResultProducts: Product[];
  isSearch: boolean = false;
  constructor(private platform: Platform,
    private navCtrl: NavController,
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
    const inventoryDbRef: AngularFireObject<Inventory> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Inventario'));
    
    inventoryDbRef.valueChanges().subscribe(inventory=>{
      if(inventory != null){
        this.inventory.Name = inventory.Name;
        this.inventory.State = inventory.State;
        this.dataSvc.setInventoryState(this.inventory.State);
      }
    });

    const productDbRef: AngularFireObject<Product> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Productos'));
    productDbRef.snapshotChanges().subscribe(dbProducts=>{
      let lstProductsInDb = dbProducts.payload.val();
      this.products = [];
      for(let i in lstProductsInDb)
      {
        lstProductsInDb[i].Code = i;
        this.products.push(lstProductsInDb[i]);
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'first');
  }

  openCreateProductModal()
  {
    this.generalSvc.openModal(CrearProductoComponent);
  }

  openImportInventoryModal()
  {
    this.generalSvc.openModal(ImportarProductosComponent)
  }

  confirmDeleteProduct(productIndex: number){

    this.generalSvc.presentAlertWithActions('Confirmar', 
    '¿Estás seguro de querer eliminar este producto? No podrás recuperarlo',
    ()=>{
      this.deleteProduct(productIndex);
    },
    ()=>{ this.generalSvc.closeAlert(); }
    );
  }

  deleteProduct(productIndex: number){
    if(this.isSearch)
    {
      this.dataSvc.setProductCode(this.searchResultProducts[productIndex].Code);
    }
    else
    {
      this.dataSvc.setProductCode(this.products[productIndex].Code);
    }
    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Producto'))
    .remove().then(()=>{
      this.generalSvc.presentToast('toastSuccess', 'Se ha eliminado el producto');
    }).catch((err)=>{
      this.generalSvc.presentToast('toastCustom',err);
    });
  }

  searchProduct(searchParam:any)
  {
    this.isSearch = true;
    
    const productDbRef: AngularFireObject<Product> = 
    this.angularFireDatabase.object(this.generalSvc.getSpecificObjectRoute('Productos'));
    
    productDbRef.snapshotChanges().subscribe(searchResults=>{
      let dbProducts = searchResults.payload.val();
      this.searchResultProducts = [];
      for(let i in dbProducts)
      {
        if(dbProducts[i].Name.includes(searchParam.detail.value))
        {
          this.searchResultProducts.push(dbProducts[i]);
        }else if(searchParam.detail.value == "")
        {
          this.isSearch = false;
        }
      }
    });
  }

  confirmInventoryFinalize(){
    this.generalSvc.presentAlertWithActions('Confirmar', 
    '¿Estás seguro de finalizar el inventario? Una vez hecho esto no podrás hacer nada para revertirlo.',
    ()=>{
      this.finalizeInventory();
    },()=>{ this.generalSvc.closeAlert(); });
  }

  finalizeInventory(){
    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Inventario'))
    .update({State: 'Finalizado'})
    .then(()=>{
      this.generalSvc.presentToast('toastSuccess','Inventario finalizado correctamente');
      this.goBack();
    });
  }

  exportInventoryToExcel()
  {
    const productsToExcel = [];
    for(let product of this.products){
      productsToExcel.push(JSON.parse(`
      {
        "Código": "${product.Code}",
        "Nombre": "${product.Name}",
        "Inventario_Inicial": "${product.InitialCuantity}",
        "Entrada": "${product.Entry}",
        "Suma_entrada": "${product.EntrySum}",
        "Salida": "${product.Exit}",
        "Inventario_actual": "${product.ActualInventory}",
        "Existencia_total": "${product.TotalExistence}",
        "Nota_final": "${product.FinalNote}"
      }`));
    }

    this.generalSvc.exportExcel(productsToExcel, 'Inventario');
  }

  goToDetails(productIndex:number)
  {
    if(this.searchResultProducts != undefined)
    {
      this.dataSvc.setProductCode(this.searchResultProducts[productIndex].Code);
      this.router.navigate(['detalles-producto']);
    }else{
      this.dataSvc.setProductCode(this.products[productIndex].Code);
      this.router.navigate(['detalles-producto'])
    } 
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
      this.router.navigate(['control-inventarios']);
    });
  }
}
