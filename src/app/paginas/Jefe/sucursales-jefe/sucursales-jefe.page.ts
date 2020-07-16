import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController, MenuController, Platform } from '@ionic/angular';
import { MenuComponent } from 'src/app/core/menu/menu.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucursales-jefe',
  templateUrl: './sucursales-jefe.page.html',
  styleUrls: ['./sucursales-jefe.page.scss'],
})
export class SucursalesJefePage implements OnInit {

  sucursales: any[] = [];
  ref: any;
  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private datos: DatosService,
    private db: AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard-jefe']);
      })
    }

  ngOnInit() {
    const clave = this.datos.getClave();
    
    this.ref = this.db.object(clave+'/Sucursales');
    this.ref.snapshotChanges().subscribe(data=>{
      let sucur = data.payload.val();
      this.sucursales = [];
      for(let i in sucur)
      {
        sucur[i].key = i;
        this.sucursales.push(sucur[i]);
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  goToInventario(i:number){
    this.datos.setSucursal(this.sucursales[i].key);
    this.router.navigate(['control-inventarios-jefe']);
  }
}
