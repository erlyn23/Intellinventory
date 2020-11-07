import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';

import { LocalNotification, LocalNotificationActionPerformed, Plugins } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';

const { Storage, 
LocalNotifications,
App, 
BackgroundTask } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  jefe: any = "";
  imagen: any = "";
  ref:any;
  constructor(private router: Router, 
    private bckgMode: BackgroundMode,
    private platform: Platform,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private db:AngularFireDatabase,
    private storage: AngularFireStorage,
    private servicio: GeneralService,
    private datos:DatosService) {
      LocalNotifications.requestPermission().then((hasPermission)=>{
        if(hasPermission.granted){
          BackgroundTask.requestPermissions();
          this.notificacionesCerradas();
        }
      });
      
      if(this.platform.pause.isStopped){
        this.bckgMode.enable();
        this.bckgMode.on('activate').subscribe(()=>{
          this.notificacionesCerradas();
        })
      }
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.salir()
      });
    }

  ngOnInit() {
    this.ref = this.db.object(this.datos.getClave()+'/Jefe')
    this.ref.snapshotChanges().subscribe(data=>{
      let jefe = data.payload.val();
      this.jefe = "";
      if(jefe != null)
      {
        this.jefe = jefe.DatosPersonales.Nombre;
        this.imagen = "";
        this.storage.ref(jefe.FotoPerfil.Ruta).getDownloadURL().subscribe(data=>{
          this.imagen = data;
        })
      }
    });
    this.notificacionesCerradas();
    this.ModoBackground();

    LocalNotifications.addListener('localNotificationActionPerformed', (localNotificationActionPerformed: LocalNotificationActionPerformed)=>{
      this.datos.setKey(localNotificationActionPerformed.notification.extra.Inventario);
      this.datos.setCedula(localNotificationActionPerformed.notification.extra.Cedula);
      this.datos.setClave(localNotificationActionPerformed.notification.extra.ClaveBar);
      this.datos.setSucursal(localNotificationActionPerformed.notification.extra.Sucursal);
      this.datos.setCode(localNotificationActionPerformed.notification.extra.Producto);
      this.router.navigate(['detalles-producto-jefe']);
    });
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  ngOnDestroy(): void {
    this.ModoBackground(); 
  }

  ModoBackground(){
    App.addListener('appStateChange', state=>{
      if(!state.isActive){
        let taskId= BackgroundTask.beforeExit(async ()=>{
          await this.notificacionesCerradas();
          BackgroundTask.finish({
            taskId
          })
        });
      }
    })
  }

  async enviarNotificacion(titulo:string, mensaje:string, id: number, datos: any){
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: titulo,
          body: mensaje,
          id: id,
          smallIcon:"ic_launcher",
          attachments: null,
          actionTypeId: "",
          extra: datos
        }
      ]
    });
  }

  notificacionesCerradas() {
    let contador = 0;
    this.servicio.getDatos('posicion').then(pos=>{
      if(pos.value == 'jefe'){
        this.servicio.getDatos('clave').then(clave=>{
          if(clave.value != null || clave.value != ''){
            this.ref = this.db.object(clave.value+'/ParaNotificaciones/Entradas');
            this.ref.snapshotChanges().subscribe(data=>{
              let datos = data.payload.val();
              for(let i in datos)
              {
                datos[i].key = i;
                this.enviarNotificacion(datos[i].NombreEmpleado + ': Entrada', datos[i].NombreSucursal + ': En el inventario ' 
                + datos[i].NombreInventario + ' al producto ' 
                + datos[i].NombreProducto, contador, 
                { ClaveBar: datos[i].ClaveBar, 
                  Cedula: datos[i].Cedula, 
                  Sucursal: datos[i].Sucursal, 
                  Inventario: datos[i].Inventario, 
                  Producto: datos[i].Producto});
                contador++;
                this.db.database.ref(clave.value+'/ParaNotificaciones/Entradas/'+datos[i].key).remove();
              }
            })
        
            this.ref = this.db.object(clave.value+'/ParaNotificaciones/Salidas');
            this.ref.snapshotChanges().subscribe(data=>{
              let datos = data.payload.val();
              for(let i in datos)
              {
                datos[i].key = i;
                this.enviarNotificacion(datos[i].NombreEmpleado + ': Salida', datos[i].NombreSucursal + ': En el inventario ' 
                + datos[i].NombreInventario + ' al producto ' 
                + datos[i].NombreProducto, contador,
                { ClaveBar: datos[i].ClaveBar, 
                  Cedula: datos[i].Cedula, 
                  Sucursal: datos[i].Sucursal, 
                  Inventario: datos[i].Inventario, 
                  Producto: datos[i].Producto});
                contador++;
                this.db.database.ref(clave.value+'/ParaNotificaciones/Salidas/'+datos[i].key).remove();
              }        
            })
          }
        })
      }
    })
  }

  async limpiarUser(){
    return (await Storage).clear();
  }

  async salir()
  {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de querer salir?',
      cssClass: 'customAlert',
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
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'ConfirmarEliminar',
          handler: ()=>{
            this.router.navigate(['login']).then(()=>{
              this.limpiarUser();
              this.menuCtrl.toggle();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  goToPage(page: string)
  {
    switch(page)
    {
      case 'empleados':
        this.router.navigate(['empleados']);
      break;  
      case 'sucursales':
        this.router.navigate(['sucursales-jefe']);
      break;
      case 'editarperfil':
        this.router.navigate(['editar-perfil-jefe']);
      break;
      case 'salir':
        this.salir();
      break;
    }
  }
}
