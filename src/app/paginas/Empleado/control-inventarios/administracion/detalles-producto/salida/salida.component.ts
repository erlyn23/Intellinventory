import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { Notification } from 'src/app/shared/models/Notification';
import { Employee } from 'src/app/shared/models/Employee';
import { Inventory } from 'src/app/shared/models/Inventory';
import { Product } from 'src/app/shared/models/Product';
import { Subsidiary } from 'src/app/shared/models/Subsidiary';

@Component({
  selector: 'app-salida',
  templateUrl: './salida.component.html',
  styleUrls: ['./salida.component.scss'],
})
export class SalidaComponent implements OnInit {

  form: FormGroup;
  notificationData: Notification = {
    Key:'',
    EmployeeName: '',
    EmployeeCode: '',
    InventoryName: '',
    InventoryKey: '',
    ProductName: '',
    ProductCode: '',
    SubsidiaryName: '',
    SubsidiaryKey: '',
    BarKey: ''
  };
  previousExit: number;
  constructor(private formBuilder:FormBuilder,
    private modalCtrl: ModalController,
    private dataSvc:DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      Cuantity: ["",[Validators.required]],
      Note: ["",[Validators.required]]
    });

    this.getEmployeeFromDb();
    this.getSubsidiaryFromDb();
    this.getInventoryFromDb();
    this.getProductFromDb();
  }

  getEmployeeFromDb()
  {
    const employeeDbObject: AngularFireObject<Employee> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Empleado'));
    employeeDbObject.valueChanges().subscribe(employeeData=>{
      this.dataSvc.setEmployeeName(employeeData.Name);
    });
  }

  getSubsidiaryFromDb()
  {    
    const subsidiaryDbObject: AngularFireObject<Subsidiary> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Sucursal'));
    subsidiaryDbObject.valueChanges().subscribe(subsidiaryData=>{
      this.notificationData.SubsidiaryName = subsidiaryData.Name;
      this.dataSvc.setSubsidiaryName(subsidiaryData.Name);
    });
  }

  getInventoryFromDb()
  {
    const inventoryDbObject: AngularFireObject<Inventory> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Inventario'));
    inventoryDbObject.valueChanges().subscribe(inventoryData=>{
      this.dataSvc.setInventoryName(inventoryData.Name);
    });
  }

  getProductFromDb()
  {
    const productDbObject: AngularFireObject<Product> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Producto'));
    productDbObject.valueChanges().subscribe(productData=>{
      this.notificationData.ProductName = productData.Name;
      this.dataSvc.setProductName(productData.Name);
    });

    productDbObject.valueChanges().subscribe(productData=>{
      this.previousExit = 0;
      this.previousExit = productData.Exit;
    });
  }
  
  giveProductExit()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Producto')).update({
        Exit: this.previousExit + this.form.value.Cuantity
        }).then(()=>{
          this.generalSvc.presentToast('toastSuccess','Salida hecha correctamente');
          this.sendNotificationData();
          this.writeExitNote();
          this.modalCtrl.dismiss();
      }).catch((err)=>{
      this.generalSvc.presentToast('customToast',err);
      });
    }
  }

  sendNotificationData()
  {
    this.assignNotificationData();

    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('ParaNotificacionesEntrada'))
    .push({
      EmployeeName: this.notificationData.EmployeeName,
      InventoryName: this.notificationData.InventoryName,
      ProductName: this.notificationData.ProductName,
      SubsidiaryName: this.notificationData.SubsidiaryName,
      BarKey: this.notificationData.BarKey,
      SubsidiaryKey: this.notificationData.SubsidiaryKey,
      InventoryKey: this.notificationData.InventoryKey,
      EmployeeCode: this.notificationData.EmployeeCode,
      ProductCode: this.notificationData.ProductCode
    });
  }

  assignNotificationData()
  {
    this.notificationData.EmployeeName = this.dataSvc.getEmployeeName();
    this.notificationData.InventoryName = this.dataSvc.getInventoryName();
    this.notificationData.ProductName = this.dataSvc.getProductName();
    this.notificationData.SubsidiaryName = this.dataSvc.getSubsidiaryName();
    this.notificationData.BarKey = this.dataSvc.getBarKey();
    this.notificationData.SubsidiaryKey = this.dataSvc.getSubsidiary();
    this.notificationData.InventoryKey = this.dataSvc.getInventoryKey();
    this.notificationData.EmployeeCode = this.dataSvc.getEmployeeCode();
    this.notificationData.ProductCode = this.dataSvc.getProductCode();
  }

  writeExitNote()
  {
    const date = new Date();
    const dateString =  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('NotasSalida')).push({
      Note: this.form.value.Note,
      Cuantity: this.form.value.Cuantity,
      Date: dateString
    });
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }
}
