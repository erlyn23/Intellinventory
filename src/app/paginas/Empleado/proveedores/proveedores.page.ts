import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { DetallesProveedorComponent } from './detalles-proveedor/detalles-proveedor.component';
import { CrearProveedorComponent } from './crear-proveedor/crear-proveedor.component';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {

  ref: any;
  proveedores: any[] = [];
  constructor(private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos: DatosService,
    private general: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores(){
    const clave = this.datos.getClave();
    this.ref = this.db.object(clave+'/Proveedores');
    this.ref.snapshotChanges().subscribe(data=>{
      let prov = data.payload.val();
      this.proveedores = [];
      for(let i in prov)
      {
        prov[i].key = i;
        this.proveedores.push(prov[i]);
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  async abrirModalProveedor()
  {
    this.datos.setOperacion('crear');
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: CrearProveedorComponent,
      
    });
    (await modal).present();
  }

  async eliminarProveedor(i: number)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este proveedor? No podrás recuperarlo',
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
            this.db.database.ref(clave+'/Proveedores/'+this.proveedores[i].key).remove().then(()=>{
              this.general.mensaje('toastSuccess', 'proveedor eliminado correctamente');
            }).catch(err=>{
              this.general.mensaje('customToast',err);
            })
          }
        }
      ]
    });
    (await alert).present();
  }

  async modificarProveedor(i: number)
  {
    this.datos.setOperacion('modificar');
    this.datos.setProveedor(this.proveedores[i]);
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: CrearProveedorComponent
    });
    (await modal).present();
  }

  async goToDetails(i:number){
    this.datos.setCode(this.proveedores[i].key);
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: DetallesProveedorComponent
    });
    (await modal).present();
  }

}
