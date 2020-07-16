import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, MenuController, NavController } from '@ionic/angular';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';
import { Plugins } from '@capacitor/core';

const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  empleados: any[];
  ref:any;
  constructor(private router: Router, 
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private db:AngularFireDatabase,
    private servicio: GeneralService,
    private datos:DatosService) { 
      LocalNotifications.requestPermission().then((hasPermission)=>{
        if(hasPermission.granted){
  
        }
      });
      this.notificacionesCerradas();
    }

  ngOnInit() {
    this.ref = this.db.object(this.datos.getClave()+'/Empleados')
    this.ref.snapshotChanges().subscribe(data=>{
      let employees = data.payload.val();
      this.empleados = [];
      for(let i in employees)
      {
        this.empleados.push(employees[i]);
      }
    })
  }

  async enviarNotificacion(titulo:any, mensaje:any){
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: titulo,
          body: mensaje,
          id: 1,
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  notificacionesCerradas() {
    this.servicio.getDatos('posicion').then(pos=>{
      if(pos.value == 'jefe'){
        this.servicio.getDatos('clave').then(clave=>{
          if(clave.value != null || clave.value != ''){
            this.ref = this.db.object(clave.value+'/ParaNotificaciones/Entrada');
            this.ref.snapshotChanges().subscribe(data=>{
              let datos = data.payload.val();
              this.enviarNotificacion(datos.NombreEmpleado + ':Entrada', 'En el inventario ' + datos.NombreInventario + ' al producto ' + datos.NombreProducto);
            })
        
            this.ref = this.db.object(clave.value+'/ParaNotificaciones/Salida');
            this.ref.snapshotChanges().subscribe(data=>{
              let datos = data.payload.val();
              this.enviarNotificacion(datos.NombreEmpleado + ':Salida', 'En el inventario ' + datos.NombreInventario + ' al producto ' + datos.NombreProducto);
        
            })
          }
        })
      }
    })
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  async abrirModal()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: ModalCrearComponent,
    });
    return await modal.present();
  }

  async abrirAlert(i: number){
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de querer eliminar este empleado? No podrás recuperarlo',
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
            this.db.database.ref('EmpleadosActivos/'+this.empleados[i].Cedula).remove();
            this.db.database.ref(this.datos.getClave()+'/Empleados/'+this.empleados[i].Cedula).remove()
            .then(()=>{
              this.servicio.mensaje('toastSuccess', 'Se ha eliminado el empleado');
              this.router.navigate(['dashboardjefe'])
            }).catch((err)=>{
              this.servicio.mensaje('toastCustom',err);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  abrirEmpleado(i:number)
  {
    this.datos.setCedula(this.empleados[i].Cedula);
    this.router.navigate(['sucursales-jefe']);
  }


  goToCreateEmployee(){
    this.abrirModal();
  }

}
