import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { Provider } from 'src/app/shared/models/Provider';


@Component({
  selector: 'app-detalles-proveedor',
  templateUrl: './detalles-proveedor.component.html',
  styleUrls: ['./detalles-proveedor.component.scss'],
})
export class DetallesProveedorComponent implements OnInit {
  
  provider: Provider;
  constructor(private modalCtrl: ModalController,
    private platform: Platform,
    private angularFireDatabase: AngularFireDatabase,
    private dataSvc: DatosService,
    private generalSvc: GeneralService
  ) { 
    this.platform.backButton.subscribeWithPriority(10, ()=>{this.goBack()});
  }

  ngOnInit() {
    const providerDbObject: AngularFireObject<Provider> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Proveedor'));
    
    providerDbObject.valueChanges().subscribe(providerData=>{
      if(providerData != null){
        this.provider = providerData;
      }
    })
  }
  goBack(){
    this.modalCtrl.dismiss();
  }

}
