import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DetallesProveedorComponent } from './detalles-proveedor/detalles-proveedor.component';
import { CrearProveedorComponent } from './crear-proveedor/crear-proveedor.component';
import { Router } from '@angular/router';
import { Provider } from 'src/app/shared/models/Provider';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {

  providers: Provider[] = [];
  constructor(private platform: Platform,
    private router: Router,
    private menuCtrl: MenuController,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase) {
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard']);
      })
     }

  ngOnInit() {
    this.getProvidersFromDb();
  }

  getProvidersFromDb(){
    const providersDbObject: AngularFireObject<Provider> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Proveedores'));
    
    providersDbObject.snapshotChanges().subscribe(providersData=>{
      let dbProviders = providersData.payload.val();
      this.providers = [];
      for(let i in dbProviders)
      {
        dbProviders[i].Key = i;
        this.providers.push(dbProviders[i]);
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  openProviderModal()
  {
    this.dataSvc.setProviderOperation('crear');
    this.generalSvc.openModal(CrearProveedorComponent);
  }

  confirmDeleteProvider(providerIndex: number)
  {

    this.generalSvc.presentAlertWithActions('Confirmar', 
    '¿Estás seguro de eliminar este proveedor? No podrás recuperarlo',
    ()=> {this.deleteProvider(providerIndex) }, ()=>{ this.generalSvc.closeAlert(); })
  }

  deleteProvider(providerIndex: number)
  {
    const providersRoute = this.generalSvc.getSpecificObjectRoute('Proveedores');

    this.angularFireDatabase.database.ref(`${providersRoute}/${this.providers[providerIndex].Key}`)
    .remove().then(()=>{
      this.generalSvc.presentToast('toastSuccess', 'proveedor eliminado correctamente');
    }).catch(err=>{
      this.generalSvc.presentToast('customToast',err);
    })
  }

  updateProvider(providerIndex: number)
  {
    this.dataSvc.setProviderOperation('modificar');
    this.dataSvc.setProvider(this.providers[providerIndex]);
    this.generalSvc.openModal(CrearProveedorComponent);
  }

  goToDetails(providerIndex:number){
    this.dataSvc.setProvider(this.providers[providerIndex]);
    this.generalSvc.openModal(DetallesProveedorComponent);
  }

}
