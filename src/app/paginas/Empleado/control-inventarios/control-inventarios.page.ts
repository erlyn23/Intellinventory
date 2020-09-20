import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, MenuController, Platform } from '@ionic/angular';
import { CrearInventarioComponent } from './crear-inventario/crear-inventario.component';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-inventarios',
  templateUrl: './control-inventarios.page.html',
  styleUrls: ['./control-inventarios.page.scss'],
})
export class ControlInventariosPage implements OnInit {

  inventarios: any[] = [];
  ref: any;
  constructor(private modalCtrl: ModalController,
    private platform: Platform,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos: DatosService,
    private servicio: GeneralService,
    private db:AngularFireDatabase,
    private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.goBack();
      })
    }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const sucursal = this.datos.getSucursal();

    this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+'/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let bdInventarios = data.payload.val();
      this.inventarios = [];
      for(let i in bdInventarios)
      {
        bdInventarios[i].key = i;
        this.inventarios.push(bdInventarios[i]);
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

  async abrirAlert(indice: number){
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
            this.eliminarInventario(indice);
          }
        }
      ]
    });
    await alert.present();
  }

  eliminarInventario(indice: number){
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const inventario = this.inventarios[indice].key;

    this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario)
    .remove().then(()=>{
      this.servicio.mensaje('toastSuccess', 'Se ha eliminado el inventario');
    }).catch((err)=>{
      this.servicio.mensaje('toastCustom',err);
    });
  }

  async confirmarEliminarSucursal()
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
            this.eliminarSucursal();
          }
        }
      ]
    });
    (await alert).present();
  }

  eliminarSucursal(){
    const clave = this.datos.getClave();
    const sucursal = this.datos.getSucursal();

    this.db.database.ref(clave+'/Sucursales/'+sucursal).remove().then(()=>{
      this.router.navigate(['sucursales']);
      this.servicio.mensaje('toastSuccess', 'Sucursal eliminada correctamente');
    }).catch(err=>{
      this.servicio.mensaje('customToast',err);
    })
  }

  goToAdministracion(indice:number)
  {
    if(this.inventarios[indice].Estado == 'Finalizado')
    {
      this.info('Este inventario ha sido marcado como finalizado, así que solo puede ver información sobre él');
      this.datos.setKey(this.inventarios[indice].key);
      this.router.navigate(['administracion']);
    }else{
      this.datos.setKey(this.inventarios[indice].key);
      this.router.navigate(['administracion']);
    }
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

  goBack(){
    this.router.navigate(['sucursales']);
  }
}
