import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CrearSucursalComponent } from './crear-sucursal/crear-sucursal.component';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  sucursales: any[] = [];
  ref: any;
  constructor(private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private router: Router) { }

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

  async eliminarSucursal(i: number)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar esta sucursal? No podrás recuperarla',
      buttons:[
        {
          cssClass:'CancelarEliminar',
          role:'cancel',
          text:'Cancelar',
          handler: ()=>{
            this.alertCtrl.dismiss();
          }
        },
        {
          cssClass:'ConfirmarEliminar',
          role:"confirm",
          text: 'Confirmar',
          handler: ()=>{
            const clave = this.datos.getClave();
            this.db.database.ref(clave+'/Sucursales/'+this.sucursales[i].key).remove().then(()=>{
              this.servicio.mensaje('toastSuccess', 'Sucursal eliminada correctamente');
            }).catch(err=>{
              this.servicio.mensaje('customToast',err);
            })
          }
        }
      ]
    });
    (await alert).present();
  }

  goToInventario(i:number)
  {
    this.datos.setSucursal(this.sucursales[i].key);
    this.router.navigate(['control-inventarios']);
  }
}
