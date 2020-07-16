import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, Platform } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CrearSucursalComponent } from './crear-sucursal/crear-sucursal.component';
import { Router } from '@angular/router';
import { PedirClaveComponent } from './pedir-clave/pedir-clave.component';
 
@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  sucursales: any[] = [];
  ref: any;
  esMiBar: boolean = false;
  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private modalCtrl: ModalController,
    private datos: DatosService,
    private db: AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard']);
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
    this.menuCtrl.enable(true, 'first');
  }

  async crearSucursal(){
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: CrearSucursalComponent
    });
    (await modal).present();
  }

  async pedirClave(){
    const modal = this.modalCtrl.create({
      cssClass: 'customModal',
      component: PedirClaveComponent,
    });
    (await modal).present();
  }

  goToInventario(i:number)
  {
    const cedula = this.datos.getCedula();
    if(this.sucursales[i].Jefe == cedula)
    {
      this.datos.setSucursal(this.sucursales[i].key);
      this.router.navigate(['control-inventarios']);
    }else{
      this.datos.setSucursal(this.sucursales[i].key);
      this.pedirClave();
    }
  }
}
