import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { Subsidiary } from 'src/app/shared/models/Subsidiary';
import { Inventory } from 'src/app/shared/models/Inventory';
import { Product } from 'src/app/shared/models/Product';
import { Employee } from 'src/app/shared/models/Employee';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-entrada-rapida',
  templateUrl: './entrada-rapida.page.html',
  styleUrls: ['./entrada-rapida.page.scss'],
})
export class EntradaRapidaPage implements OnInit {

  form: FormGroup;
  subsidiaries: Subsidiary[] = [];
  inventories: Inventory[] = [];
  subsidiaryNeedPassword: boolean;
  employeeCodeOfAnother: string;
  errorMessageForWrongSubsidiaryPassword: string = "";
  errorMessageForProductNotFound: string = "";
  subsidiary: Subsidiary;
  product: Product;
  inventory: Inventory;
  previousEntry: number = 0;
  constructor(private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase) { }

    
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }


  ngOnInit() {
    this.form = this.formBuilder.group({
      Code: ["", [Validators.required]],
      Subsidiary: ["", [Validators.required]],
      Password: [""],
      Inventory: ["", [Validators.required]],
      Cuantity: ["", [Validators.required]],
      EntryNote: ["", [Validators.required]]
    });
    this.getEmployeeNameFromDb();
    this.getSubsidiaries();
  }

  getEmployeeNameFromDb(){
    const employeeDbObject: AngularFireObject<Employee> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Empleado'));
    
    employeeDbObject.valueChanges().subscribe(employeeData=>{
      this.dataSvc.setEmployeeName(employeeData.Name);
    });
  }
  
  getSubsidiaries(){
    const subsidiariesDbObject: AngularFireObject<Subsidiary> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Sucursales'));
    
    subsidiariesDbObject.snapshotChanges().subscribe(subsidiariesData=>{
      let dbSubsidiaries = subsidiariesData.payload.val();
      this.subsidiaries = []; 
      for(let i in dbSubsidiaries){
        dbSubsidiaries[i].key = i;
        this.subsidiaries.push(dbSubsidiaries[i]);
      }
    })
  }

  searchSubsidiary(selectedSubsidiary)
  {
    this.Password.setValue('');
    this.Code.setValue('');
    this.errorMessageForWrongSubsidiaryPassword = "";
    if(selectedSubsidiary.detail.value != '')
    {
        const subsidiaryDbObject: AngularFireObject<Subsidiary> = this.angularFireDatabase
        .object(`${this.generalSvc.getSpecificObjectRoute('Sucursales')}/${selectedSubsidiary.detail.value}`);
        
        subsidiaryDbObject.valueChanges().subscribe(subsidiaryData=>{
        this.subsidiary = subsidiaryData;
        if(this.dataSvc.getEmployeeCode() != this.subsidiary.Boss)
        {
          this.subsidiaryNeedPassword = true;
        }
        else
        {
          this.subsidiaryNeedPassword = false;
        }
      });
      this.dataSvc.setSubsidiary(selectedSubsidiary.detail.value);
      this.getInventories('');
    }
  }

  getInventories(employeeCode: string){
    this.Code.setValue('');
    this.errorMessageForProductNotFound = "";
    if(employeeCode == '')
    {
      const inventoriesDbObject: AngularFireObject<Inventory> = this.angularFireDatabase
      .object(this.generalSvc.getSpecificObjectRoute('Inventarios'));
      
      inventoriesDbObject.snapshotChanges().subscribe(inventoryData=>{
        let dbInventories = inventoryData.payload.val();
        this.inventories = [];
        for(let i in dbInventories){
          if(dbInventories[i].State != 'Finalizado')
          {
            dbInventories[i].Key = i;
            this.inventories.push(dbInventories[i]);
          }
        }
      });
    }
    else
    {
      const subsidiaryDbRoute = this.generalSvc.getSpecificObjectRoute('Sucursal');

      const inventoriesDbObject: AngularFireObject<Inventory> = this.angularFireDatabase
      .object(`${subsidiaryDbRoute}/Inventarios/${employeeCode}`);
      
      inventoriesDbObject.snapshotChanges().subscribe(inventoriesData=>{
        let dbInventories = inventoriesData.payload.val();
        this.inventories = [];
        for(let i in dbInventories){
          if(dbInventories[i].State != 'Finalizado')
          {
            dbInventories[i].Key = i;
            this.inventories.push(dbInventories[i]);
          }
        }
      });
    }
  }

  searchAnotherEmployeeInventory(selectedInventory:any)
  {
    if(selectedInventory.detail.value == this.subsidiary.Password)
    {
      this.employeeCodeOfAnother = this.subsidiary.Boss;
      this.dataSvc.setSubsidiary(this.Subsidiary.value);
      this.getInventories(this.employeeCodeOfAnother);
      this.errorMessageForWrongSubsidiaryPassword = "";
    }
    else
    {
      this.inventories = [];
      this.errorMessageForWrongSubsidiaryPassword = "Contraseña incorrecta";
    }
  }


  searchInventory(val: any){

    let inventoryDbObject: AngularFireObject<Inventory>;
    if(val.detail.value != '')
    {
      if(this.employeeCodeOfAnother.length > 0 && this.subsidiaryNeedPassword)
      {
          const subsidiaryDbRoute = this.generalSvc.getSpecificObjectRoute('Sucursal'); 

          inventoryDbObject = this.angularFireDatabase
          .object(`${subsidiaryDbRoute}/${this.employeeCodeOfAnother}/${val.detail.value}`);
          
          inventoryDbObject.valueChanges().subscribe(inventoryData=>{
          this.inventory = inventoryData;
        });
        this.dataSvc.setInventoryKey(val.detail.value);
      }
      else
      {
        inventoryDbObject = this.angularFireDatabase
        .object(`${this.generalSvc.getSpecificObjectRoute('Inventarios')}/${val.detail.value}`);
        
        inventoryDbObject.valueChanges().subscribe(inventoryData=>{
          this.inventory = inventoryData;
        });
        this.dataSvc.setInventoryKey(val.detail.value);
      }
    }
  }

  getProduct(val: any){
    let productCode = val.detail.value;
    
    let productDbObject: AngularFireObject<Product>;

    if(productCode != '')
    {
      if(this.employeeCodeOfAnother.length > 0 && this.subsidiaryNeedPassword)
      {
        const subsidiaryDbRoute = this.generalSvc.getSpecificObjectRoute('Sucursal'); 

        productDbObject = this.angularFireDatabase
        .object(`${subsidiaryDbRoute}/${this.employeeCodeOfAnother}/${this.dataSvc.getInventoryKey()}/Productos/${productCode}`);
        
        productDbObject.valueChanges().subscribe(productData=>{
          if(productData != null){
            this.product = productData;
            this.dataSvc.setProductName(this.product.Name);
            this.errorMessageForProductNotFound = "";
          }else{
            this.errorMessageForProductNotFound = "El producto no existe."
          }
          this.previousEntry = productData.Entry;
        });
      
      }
      else
      {
        productDbObject = this.angularFireDatabase
        .object(`${this.generalSvc.getSpecificObjectRoute('Productos')}/${productCode}`);
        
        productDbObject.valueChanges().subscribe(productData=>{
          if(productData != null){
            this.product = productData;
            this.dataSvc.setProductName(this.product.Name);
            this.previousEntry = productData.Entry;
            this.errorMessageForProductNotFound = "";
          }else{
            this.errorMessageForProductNotFound = "El producto no existe.";
          }
        });
      }
    }
  }

  readBarCode(){
    this.generalSvc.readBarCode().then(async ()=>{

      let code = await Clipboard.read(); 
      this.Code.setValue(code);
    });
    
    this.generalSvc.presentToast('toastSuccess', 'Código leído, pegue el código en el campo.')
  }

  giveProductEntry(){
    const subsidiary = this.Subsidiary.value;
    const inventory = this.Inventory.value;
    const product = this.Code.value;

    if(this.form.valid && this.errorMessageForProductNotFound == ""){
      if(this.subsidiaryNeedPassword){
          const subsidiaresRoute = this.generalSvc.getSpecificObjectRoute('Sucursales');

          this.Password.setValidators(Validators.required);
          this.angularFireDatabase.database
          .ref(`${subsidiaresRoute}}/${subsidiary}/Inventarios/${this.employeeCodeOfAnother}/${inventory}/Productos/${product}`)
          .update({
            Entry: this.previousEntry + this.Cuantity.value
          }).then(()=>{

            this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('ParaNotificacionesEntrada'))
            .push({
              EmployeeName: this.dataSvc.getEmployeeName(),
              SubsidiaryName: this.subsidiary.Name,
              InventoryName: this.inventory.Name,
              ProductName: this.dataSvc.getProductName(),
              BarKey: this.dataSvc.getBarKey(),
              Subsidiary: subsidiary,
              Inventory: inventory,
              EmployeeCode: this.employeeCodeOfAnother,
              Product: product,
            });

            const date = new Date();
            const dateString =  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} 
            ${date.getHours()}:${date.getMinutes()}`;        
            
            this.angularFireDatabase.database
            .ref(`${subsidiaresRoute}}/${subsidiary}/Inventarios/${this.employeeCodeOfAnother}/${inventory}/Productos/${product}/NotasEntrada`).push({
              Note: this.EntryNote.value,
              Cuantity: this.Cuantity.value,
              Date: dateString
            });
            this.generalSvc.presentToast('toastSuccess', 'Entrada hecha correctamente').then(()=>{
              this.form.reset();
              this.subsidiaryNeedPassword = false;
            });
          }).catch(err=>{
            this.generalSvc.presentToast('customToast', err);
          })
        }else{
          this.Password.clearValidators();
          this.angularFireDatabase.database.ref(`${this.generalSvc.getSpecificObjectRoute('Productos')}/${product}`)
          .update({
              Entry: this.previousEntry + this.Cuantity.value
            }).then(()=>{
              this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('ParaNotifiacionesEntrada')).push({
                EmployeeName: this.dataSvc.getEmployeeName(),
                SubsidiaryName: this.subsidiary.Name,
                InventoryName: this.inventory.Name,
                ProductName: this.dataSvc.getProductName(),
                BarKey: this.dataSvc.getBarKey(),
                Subsidiary: subsidiary,
                Inventory: inventory,
                EmployeeCode: this.dataSvc.getEmployeeCode(),
                Product: product
              });
              
              const date = new Date();
              const dateString =  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} 
              ${date.getHours()}:${date.getMinutes()}`; 

              this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('NotasEntrada'))
              .push({
                Note: this.EntryNote.value,
                Cuantity: this.Cuantity.value,
                Date: dateString
              });
              this.generalSvc.presentToast('toastSuccess', 'Entrada hecha correctamente').then(()=>{
                this.form.reset();
                this.subsidiaryNeedPassword = false;
              });
            }).catch(err=>{
              this.generalSvc.presentToast('customToast', err);
            })
        } 
      }else{
        this.generalSvc.presentToast('customToast', 'La contraseña es incorrecta o el producto no existe');
      }
  }

  get Code()
  {
    return this.form.get('Code');
  }

  get Subsidiary()
  {
    return this.form.get('Subsidiary');
  }

  get Password()
  {
    return this.form.get('Password');
  }

  get Inventory()
  {
    return this.form.get('Inventory');
  }

  get Cuantity()
  {
    return this.form.get('Cuantity');
  }

  get EntryNote()
  {
    return this.form.get('EntryNote');
  }

}