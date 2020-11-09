import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { Provider } from 'src/app/shared/models/Provider';


@Component({
  selector: 'app-detalles-proveedor',
  templateUrl: './detalles-proveedor.component.html',
  styleUrls: ['./detalles-proveedor.component.scss'],
})
export class DetallesProveedorComponent implements OnInit {
  
  provider: Provider = {
    Key:'',
    Name: '',
    Product: '',
    PhoneNumber: '',
    Cuantity: 0
  };
  constructor(private modalCtrl: ModalController,
    private platform: Platform,
    private dataSvc: DatosService
  ) { 
    this.platform.backButton.subscribeWithPriority(10, ()=>{this.goBack()});
  }

  ngOnInit() {
    this.provider = this.dataSvc.getProvider();
  }
  goBack(){
    this.modalCtrl.dismiss();
  }

}
