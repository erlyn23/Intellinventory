import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { Inventory } from 'src/app/shared/models/Inventory';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-importar-productos',
  templateUrl: './importar-productos.component.html',
  styleUrls: ['./importar-productos.component.scss'],
})
export class ImportarProductosComponent implements OnInit {

  form: FormGroup;
  inventoriesDbRef: AngularFireObject<Inventory>;
  inventories: Inventory[] = [];
  products: Product[] = [];
  constructor(private formBuilder: FormBuilder,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      Inventories: [""]
    })

    const barKey = this.dataSvc.getBarKey();
    const subsidiary = this.dataSvc.getSubsidiary();
    const employeeCode = this.dataSvc.getEmployeeCode();

    this.inventoriesDbRef = this.angularFireDatabase.object(barKey+'/Sucursales/'+subsidiary+'/Inventarios/'+employeeCode);
    this.inventoriesDbRef.snapshotChanges().subscribe(inventoriesData=>{
      let inventories = inventoriesData.payload.val();
      this.inventories = [];
      for(let i in inventories){
        inventories[i].Key = i;
        this.inventories.push(inventories[i]);
      }
    })
  }

  searchProducts(searchParam:any){
    const barKey = this.dataSvc.getBarKey();
    const subsidiary = this.dataSvc.getSubsidiary();
    const employeeCode = this.dataSvc.getEmployeeCode();

    const productsDbRef: AngularFireObject<Product> = 
    this.angularFireDatabase.object(barKey+'/Sucursales/'+subsidiary+'/Inventarios/'+employeeCode+'/'+searchParam.detail.value+'/Productos');
    productsDbRef.snapshotChanges().subscribe(productData=>{
      let dbProducts = productData.payload.val();
      this.products = [];
      for(let i in dbProducts){
        dbProducts[i].Code = i;
        this.products.push(dbProducts[i]);
      }
    })
  }

  importProducts(){
    const barKey = this.dataSvc.getBarKey();
    const subsidiary = this.dataSvc.getSubsidiary();
    const employeeCode = this.dataSvc.getEmployeeCode();
    const inventoryKey = this.dataSvc.getInventoryKey();
    
    for(let i in this.products)
    {
      let product = this.products[i];
      this.angularFireDatabase.database.ref(barKey+'/Sucursales/'+subsidiary+'/Inventarios/'+employeeCode+'/'+inventoryKey+'/Productos/'+product.Code).update({
        Code: product.Code,
        Name: product.Name,
        InitialCuantity: product.ActualInventory,
        Entry: 0,
        EntrySum: product.EntrySum,
        Exit: 0,
        TotalExistence: product.TotalExistence,
        ActualInventory: 0,
        Difference: product.Difference,
        FinalNote: product.FinalNote
      })
    }
    this.generalSvc.closeModal();
  }

  goBack(){
    this.generalSvc.closeModal();
  }
}
