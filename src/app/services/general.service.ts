import { ComponentRef, Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Plugins} from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import { Product } from 'src/app/shared/models/Product';
import * as XLSX from 'xlsx';
import { DatosService } from './datos.service';


const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private dataSvc: DatosService,
    private db:AngularFireDatabase,
    private barcode: BarcodeScanner,
    private file: File) { }

  async presentToast(clase:any,message:any)
  {
    const toast = await this.toastCtrl.create({
      cssClass: clase,
      message: message,
      duration: 3000
    });
    await toast.present();
  }

  async presentSimpleAlert(message: string, title: string)
  {
    const alert = await this.alertCtrl.create({
      cssClass:'customAlert',
      header: title,
      message: message,
      buttons:[
        {
          cssClass:'CancelarEliminar',
          role: 'cancel',
          text: 'Aceptar',
          handler: ()=>{ 
            this.alertCtrl.dismiss();
          }
        },
      ]
    });
    await alert.present();
  }

  async presentAlertWithActions(title: string, 
    message: string, confirmHandler: any, 
    cancelHandler: any)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: title,
      message: message,
      buttons:[
        {
          cssClass:'CancelarEliminar',
          role: 'confirm',
          text: 'Confirmar',
          handler: confirmHandler
        },
        {
          cssClass:'ConfirmarEliminar',
          role: 'cancel',
          text: 'Cancelar',
          handler: cancelHandler
        }
      ]
    });
    return await alert.present();
  }

  closeAlert()
  {
    this.alertCtrl.dismiss();
  }

  async presentLoading(message: string)
  {
    const loading = this.loadingCtrl.create({
      cssClass: 'miLoading',
      message: message
    });
    
    (await loading).present();
  }

  closeLoading()
  {
    this.loadingCtrl.dismiss();
  }

  async openModal(component: any)
  {
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: component
    });
    await modal.present();
  }

  closeModal()
  {
    this.modalCtrl.dismiss();
  }

  insertDataInDb(path:string, data:any)
  {
    return this.db.database.ref(path).update(data);
  }

  async getLocalStorageData(key: string):Promise <{value: string}>
  {
    return (await Storage.get({key: key}));
  }

  async saveDataInLocalStorage(key: string, valor: any)
  {
    await Storage.set({key: key, value: valor});
  }

  async clearLocalStorageData(){
    return (await Storage).clear();
  }

  async readBarCode(){
    return await this.barcode.scan();
  }

  exportExcel(json: Product[], fileName: string){
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workBook: XLSX.WorkBook = { Sheets: {'data':workSheet}, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    this.saveExcel(excelBuffer, fileName);    
  }

  saveExcel(buffer: any, fileName: string)
  {
    const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    const fullFileName = fileName + '-'+ Date.now() +'.xlsx';
    this.file.writeFile(this.file.externalApplicationStorageDirectory,fullFileName, data).then(()=>{
      this.presentToast('toastSuccess', 'Excel exportado correctamente');
      this.presentToast('toastSuccess', 'Archivo guardado en el directorio raíz del dispositivo')
    }).catch(err=>{
      this.presentToast('customToast', err.message);
    });
  }

  getSpecificObjectRoute(routeOrigin: string): string
  {
    const barKey: string = this.dataSvc.getBarKey();
    const subsidiary: string = this.dataSvc.getSubsidiary();
    const employeeCode: string = this.dataSvc.getEmployeeCode();
    const inventoryKey: string = this.dataSvc.getInventoryKey();
    const productCode : string= this.dataSvc.getProductCode();
    const providerCode: string = this.dataSvc.getProvider().Key;
    
    const bossRoute = `${barKey}/Jefe`;
    const activeEmployeesRoute = `EmpleadosActivos`;
    const employeesRoute = `${barKey}/Empleados`;
    const employeeRoute = `${employeesRoute}/${employeeCode}`;
    const toEntryNotificationsRoute = `${barKey}/ParaNotificaciones/Entrada`;
    const toExitNotificationsRoute = `${barKey}/ParaNotificaciones/Salida`;
    const providersRoute = `${barKey}/Proveedores`;
    const providerRoute = `${providersRoute}/${providerCode}`;
    const stocksRoute = `${barKey}/Stock/${employeeCode}`;
    const stockRoute = `${stocksRoute}/${productCode}`;
    const subsidiariesRoute = `${barKey}/Sucursales`;
    const subsidiaryRoute = `${subsidiariesRoute}/${subsidiary}`;
    const inventoriesRoute = `${subsidiaryRoute}/Inventarios/${employeeCode}`;
    const inventoryRoute = `${inventoriesRoute}/${inventoryKey}`;
    const productsRoute = `${inventoryRoute}/Productos`;
    const productRoute = `${productsRoute}/${productCode}`;
    const entryNotesRoute = `${productRoute}/NotasEntrada`;
    const exitNotesRoute = `${productRoute}/NotasSalida`;

    switch(routeOrigin)
    {
      case "Jefe": 
        return bossRoute;
      
      case "EmpleadosActivos":
        return activeEmployeesRoute;

      case "Empleados":
        return employeesRoute;

      case "Empleado":
        return employeeRoute;
      
      case "ParaNotificacionesEntrada":
        return toEntryNotificationsRoute;
      
      case "ParaNotificacionesSalida":
        return toExitNotificationsRoute;
      
      case "Proveedores":
        return providersRoute;
      
      case "Proveedor":
        return providerRoute;

      case "Stocks":
        return stocksRoute;

      case "Stock":
        return stockRoute;

      case "Sucursales":
        return subsidiariesRoute;

      case "Sucursal":
        return subsidiaryRoute;

      case "Inventarios":
        return inventoriesRoute;
      
      case "Inventario":
        return inventoryRoute;

      case "Productos":
        return productsRoute;
      
      case "Producto":
        return productRoute;
      
      case "NotasEntrada":
        return entryNotesRoute;

      case "NotasSalida":
        return exitNotesRoute;
        
      default: 
        return "";
    }
  }
}
