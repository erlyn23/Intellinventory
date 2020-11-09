import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { CrearSucursalComponent } from './crear-sucursal/crear-sucursal.component';
import { Router } from '@angular/router';
import { PedirClaveComponent } from './pedir-clave/pedir-clave.component';
import { Subsidiary } from 'src/app/shared/models/Subsidiary';
import { GeneralService } from 'src/app/services/general.service';
 
@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  subsidiaries: Subsidiary[] = [];
  isMyBar: boolean = false;
  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private anuglarFireDatabase: AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard']);
      })
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  ngOnInit() {
    this.getSubsidiariesFromDb();
  }

  getSubsidiariesFromDb(){
    const subsidiariesDbObject: AngularFireObject<Subsidiary> = this.anuglarFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Sucursales'));
    
    subsidiariesDbObject.snapshotChanges().subscribe(subsidiariesData=>{
      let dbSubsidiaries = subsidiariesData.payload.val();
      this.subsidiaries = [];
      for(let i in dbSubsidiaries)
      {
        dbSubsidiaries[i].Key = i;
        this.subsidiaries.push(dbSubsidiaries[i]);
      }
    });
  }

  refreshSubsidiariesList(event){
    setTimeout(()=>{
      this.getSubsidiariesFromDb();
      event.target.complete();
    }, 2000);
  }

  openCreateSubsidiaryModal(){
    this.generalSvc.openModal(CrearSucursalComponent);
  }

  goToInventoryPage(i:number)
  {
    const cedula = this.dataSvc.getEmployeeCode();
    if(this.subsidiaries[i].Boss == cedula)
    {
      this.dataSvc.setSubsidiary(this.subsidiaries[i].Key);
      this.router.navigate(['control-inventarios']);
    }else{
      this.dataSvc.setSubsidiary(this.subsidiaries[i].Key);
      this.openRequestSubsidiaryPasswordModal();
    }
  }

  openRequestSubsidiaryPasswordModal(){
    this.generalSvc.openModal(PedirClaveComponent);
  }
}
