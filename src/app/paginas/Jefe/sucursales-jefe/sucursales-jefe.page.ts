import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { MenuController, Platform } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Subsidiary } from 'src/app/shared/models/Subsidiary';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-sucursales-jefe',
  templateUrl: './sucursales-jefe.page.html',
  styleUrls: ['./sucursales-jefe.page.scss'],
})
export class SucursalesJefePage implements OnInit {

  subsidiaries: Subsidiary[] = [];
  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private dataSvc: DatosService,
    private generalSvc: GeneralService,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard-jefe']);
      })
    }

  ngOnInit() {
    const subsidiariesDbObject: AngularFireObject<Subsidiary> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Sucursales'));
    
    subsidiariesDbObject.snapshotChanges().subscribe(subsidiaryData=>{
      let dbSubsidiaries = subsidiaryData.payload.val();
      this.subsidiaries = [];
      for(let i in dbSubsidiaries)
      {
        dbSubsidiaries[i].key = i;
        this.subsidiaries.push(dbSubsidiaries[i]);
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  goToInventories(i:number){
    this.dataSvc.setSubsidiary(this.subsidiaries[i].Key);
    this.dataSvc.setEmployeeCode(this.subsidiaries[i].Boss);
    this.router.navigate(['control-inventarios-jefe']);
  }
}
