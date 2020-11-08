import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Inventory } from 'src/app/shared/models/Inventory';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-control-inventarios',
  templateUrl: './control-inventarios.page.html',
  styleUrls: ['./control-inventarios.page.scss'],
})
export class ControlInventariosPage implements OnInit {

  inventories: Inventory[]=[];
  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.goBack();
      })
    }

  ngOnInit() {
    const inventoriesDbObject: AngularFireObject<Inventory> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Inventarios'));
    
    inventoriesDbObject.snapshotChanges().subscribe(inventoriesData=>{
      let dbInventories = inventoriesData.payload.val();
      this.inventories = [];
      for(let i in dbInventories)
      {
        dbInventories[i].Key = i;
        this.inventories.push(dbInventories[i]);
      }
    })
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'second');
  }

  goBack(){
    this.router.navigate(['sucursales-jefe']);
  }

  goToInventoryAdministrationPage(inventoryIndex:number)
  {
    this.dataSvc.setInventoryKey(this.inventories[inventoryIndex].Key);
    this.router.navigate(['administracion-jefe'])
  }

}
