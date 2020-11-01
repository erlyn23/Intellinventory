import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
    private db:AngularFireDatabase,
    private barcode: BarcodeScanner,
    private file: File) { }

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

  exportarExcel(json: any[], nombreArchivo: string){
    const hojaDeTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const libroDeTrabajo: XLSX.WorkBook = { Sheets: {'data':hojaDeTrabajo}, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(libroDeTrabajo, { bookType: 'xlsx', type: 'array' });
    this.guardarExcel(excelBuffer, nombreArchivo);    
  }

  guardarExcel(buffer: any, nombreArchivo: string)
  {
    const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    const nombreCompleto = nombreArchivo + '-'+ Date.now() +'.xlsx';
    this.file.writeFile(this.file.externalApplicationStorageDirectory,nombreCompleto, data).then(()=>{
      this.mensaje('toastSuccess', 'Excel exportado correctamente');
      this.mensaje('toastSuccess', 'Archivo guardado en el directorio raíz del dispositivo')
    }).catch(err=>{
      this.mensaje('customToast', err.message);
    });
  }
}
