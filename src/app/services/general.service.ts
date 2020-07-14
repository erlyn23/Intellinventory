import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Plugins} from '@capacitor/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private toastCtrl: ToastController,
    private db:AngularFireDatabase,
    private barcode: BarcodeScanner) { }

  async mensaje(clase:any,message:any)
  {
    const toast = await this.toastCtrl.create({
      cssClass: clase,
      message: message,
      duration: 3000
    });
    await toast.present();
  }

  insertarenlaBD(ruta:any, datos:any)
  {
    return this.db.database.ref(ruta).set(datos);
  }

  async getDatos(llave:any){
    return (await Storage).get({key: llave});
  }

  async leerCodigo(){
    return await this.barcode.scan();
  }

  async exportarExcel(json: any[], NombreArchivo: string){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: {'data':worksheet}, SheetNames: ['data'] };
    const ExcelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return await this.guardarExcel(ExcelBuffer, NombreArchivo);    
  }

  guardarExcel(buffer: any, nombreArchivo: string)
  {
    const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});

    FileSaver.saveAs(data, nombreArchivo + '__Export__'+ Date.now() +'.xlsx');
  }
}
