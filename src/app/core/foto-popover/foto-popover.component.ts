import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { PopoverController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-foto-popover',
  templateUrl: './foto-popover.component.html',
  styleUrls: ['./foto-popover.component.scss'],
})
export class FotoPopoverComponent implements OnInit {

  image: any;
  constructor(private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireStorage: AngularFireStorage) { }

  ngOnInit() {}

  uploadImage(imageData: any)
  {
    this.generalSvc.getLocalStorageData('role').then(role=>{
      if(role.value == 'boss')
      {
        const bossId = this.dataSvc.getBarKey();
        this.image = imageData.target.files[0];
        const filePath = `PerfilJefe/${bossId}`;
        
        this.generalSvc.presentAlertWithActions('Confirmar', 
        '¿Estás seguro de querer subir este archivo?',
        ()=>{
          this.generalSvc.presentLoading('Subiendo imagen, por favor espera...');
          this.saveImageInDb(filePath);
        }, ()=>{
          this.generalSvc.closeAlert();
        });
      }
      else
      {
        const employeeCode = this.dataSvc.getEmployeeCode();
        this.image = imageData.target.files[0];
        const filePath = `Perfil/${employeeCode}`;
        this.generalSvc.presentAlertWithActions('Confirmar', 
        '¿Estás seguro de querer subir este archivo?',
        ()=>{
          this.generalSvc.presentLoading('Subiendo imagen, por favor espera...');
          this.saveImageInDb(filePath);
        }, ()=>{
          this.generalSvc.closeAlert();
        });
      }
    });
  }

  saveImageInDb(filePath: string){
      this.generalSvc.getLocalStorageData('role').then(role=>{
        if(role.value == 'boss'){
          const fileRef = this.angularFireStorage.ref(filePath);
          const uploadTask = this.angularFireStorage.upload(filePath, this.image);
          uploadTask.percentageChanges().subscribe(percent=>{
            if(percent == 100)
            {
              const barKey = this.dataSvc.getBarKey();
              this.modalCtrl.dismiss();
              this.generalSvc.presentToast('toastSuccess', 'Imagen cambiada correctamente');
              this.generalSvc.closeLoading();
              this.generalSvc.insertDataInDb(this.generalSvc.getSpecificObjectRoute('Jefe'),{Photo: ''}).catch(err=>{
                this.generalSvc.presentToast('customToast',err);
              });
              this.generalSvc.insertDataInDb(this.generalSvc.getSpecificObjectRoute('Jefe'),{Photo: filePath}).catch(err=>{
                this.generalSvc.presentToast('customToast',err);
              });
              this.popoverCtrl.dismiss();
            }
          });
        }else{
          const fileRef = this.angularFireStorage.ref(filePath);
          const uploadTask = this.angularFireStorage.upload(filePath, this.image);
          uploadTask.percentageChanges().subscribe(porcentaje=>{
            if(porcentaje == 100)
            {
              const barKey = this.dataSvc.getBarKey();
              const employeeCode = this.dataSvc.getEmployeeCode();
              this.modalCtrl.dismiss();
              this.generalSvc.presentToast('toastSuccess', 'Imagen cambiada correctamente');
              this.generalSvc.closeLoading();
              this.generalSvc.insertDataInDb(this.generalSvc.getSpecificObjectRoute('Empleado'),{Photo: ''}).catch(err=>{
                this.generalSvc.presentToast('customToast', err);
              });
              this.generalSvc.insertDataInDb(this.generalSvc.getSpecificObjectRoute('Empleado'),{Photo: filePath}).catch(err=>{
              this.generalSvc.presentToast('customToast',err);
            });
          this.popoverCtrl.dismiss();
        }
      });
      }
    })
  }
}
