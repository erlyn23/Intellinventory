import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Plugins} from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';


const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {


  constructor(private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
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

  insertDataInDb(path:string, data:any)
  {
    return this.db.database.ref(path).set(data);
  }

  async getLocalStorageData(key:any){
    return (await Storage).get({key: key});
  }

  async clearLocalStorageData(){
    return (await Storage).clear();
  }

  async readCode(){
    return await this.barcode.scan();
  }

  exportExcel(json: any[], fileName: string){
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
}
