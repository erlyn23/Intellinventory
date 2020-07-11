import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, MenuController } from '@ionic/angular';
import { CrearInventarioComponent } from './crear-inventario/crear-inventario.component';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { Button } from 'protractor';

@Component({
  selector: 'app-control-inventarios',
  templateUrl: './control-inventarios.page.html',
  styleUrls: ['./control-inventarios.page.scss'],
})
export class ControlInventariosPage implements OnInit {

  inventarios: any[] = [];
  ref: any;
  constructor(private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos: DatosService,
    private servicio: GeneralService,
    private db:AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const sucursal = this.datos.getSucursal();

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+'/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let invrios = data.payload.val();
      this.inventarios = [];
      for(let i in invrios)
      {
        invrios[i].key = i;
        this.inventarios.push(invrios[i]);
      }
    })
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }
  
  async abrirModal()
  {
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: CrearInventarioComponent, 
      animated: true
    });
    await modal.present();
  }

  async abrirAlert(i: number){
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de querer eliminar este inventario? No podrás recuperarlo',
      buttons:
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'CancelarEliminar',
          handler: ()=>{
            this.alertCtrl.dismiss();
          }
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'ConfirmarEliminar',
          handler: ()=>{
            const claveBar = this.datos.getClave();
            const sucursal = this.datos.getSucursal();
            this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+this.datos.getCedula()+'/'+this.inventarios[i].key)
            .remove().then(()=>{
              this.servicio.mensaje('toastSuccess', 'Se ha eliminado el inventario');
            }).catch((err)=>{
              this.servicio.mensaje('toastCustom',err);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async info(mensaje: string)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Información',
      message: mensaje,
      buttons:
      [
        {
          cssClass: 'CancelarEliminar',
          role: 'cancel',
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }

  goToAdministracion(i:number)
  {
    if(this.inventarios[i].Estado == 'Finalizado')
    {
      this.info('Este inventario ha sido marcado como finalizado, así que solo puede ver información sobre él');
      this.datos.setKey(this.inventarios[i].key);
      this.router.navigate(['administracion']);
    }else{
      this.datos.setKey(this.inventarios[i].key);
      this.router.navigate(['administracion']);
    }
  }
}
