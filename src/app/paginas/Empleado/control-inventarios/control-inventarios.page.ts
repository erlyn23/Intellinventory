import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { CrearInventarioComponent } from './crear-inventario/crear-inventario.component';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { Inventory } from './../../../shared/models/Inventory';

@Component({
  selector: 'app-control-inventarios',
  templateUrl: './control-inventarios.page.html',
  styleUrls: ['./control-inventarios.page.scss'],
})
export class ControlInventariosPage implements OnInit {

  inventories: Inventory[] = [];
  inventoryDbRef: AngularFireObject<Inventory>;
  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase:AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.goBack();
      })
    }

  ngOnInit() {
    this.inventoryDbRef = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Inventarios'));
    
    this.inventoryDbRef.snapshotChanges().subscribe(data=>{
      let inventoriesDb = data.payload.val();
      this.inventories = [];
      for(let i in inventoriesDb)
      {
        inventoriesDb[i].Key = i;
        this.inventories.push(inventoriesDb[i]);
      }
    })
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }
  
  openCreateInventoryModal()
  {
    this.generalSvc.openModal(CrearInventarioComponent);
  }

  confirmDeleteInventory(inventoryIndex: number){

    this.generalSvc.presentAlertWithActions('Confirmar', 
    '¿Estás seguro de querer eliminar este inventario? No podrás recuperarlo',
    ()=>{
      this.deleteInventory(inventoryIndex);
    }, ()=>{
      this.generalSvc.closeAlert();
    })
  }

  deleteInventory(inventoryIndex: number){

    this.angularFireDatabase.database
    .ref(this.generalSvc.getSpecificObjectRoute('Inventario'))
    .remove().then(()=>{
      this.generalSvc.presentToast('toastSuccess', 'Se ha eliminado el inventario');
    }).catch((err)=>{
      this.generalSvc.presentToast('toastCustom',err);
    });
  }

  confirmDeleteSubsidiary()
  {

    this.generalSvc.presentAlertWithActions('Confirmar', 
    '¿Está seguro de eliminar esta sucursal? No podrás recuperarla',
    ()=>{
      this.deleteSubsidiary();
    },
    ()=>{
      this.generalSvc.closeAlert();
    });
  }

  deleteSubsidiary(){
    this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Sucursal')).remove().then(()=>{
      this.router.navigate(['sucursales']);
      this.generalSvc.presentToast('toastSuccess', 'Sucursal eliminada correctamente');
    }).catch(err=>{
      this.generalSvc.presentToast('customToast',err);
    })
  }

  goToAdministration(inventoryIndex:number)
  {
    if(this.inventories[inventoryIndex].State == 'Finalizado')
    {
      this.generalSvc.presentSimpleAlert('Este inventario ha sido marcado como finalizado, así que solo puede ver información sobre él',
      'Información');
      this.dataSvc.setInventoryKey(this.inventories[inventoryIndex].Key);
      this.router.navigate(['administracion']);
    }else{
      this.dataSvc.setInventoryKey(this.inventories[inventoryIndex].Key);
      this.router.navigate(['administracion']);
    }
  }

  goBack(){
    this.router.navigate(['sucursales']);
  }
}
