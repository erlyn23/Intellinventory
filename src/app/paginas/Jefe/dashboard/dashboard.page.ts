import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';

import { LocalNotificationActionPerformed, Plugins } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Boss } from 'src/app/shared/models/Boss';
import { Notification } from 'src/app/shared/models/Notification';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  boss: Boss = { Email :'', 
  Password: '', 
  Photo: '', 
  PhoneNumber: '', 
  Name: '', 
  CompanyName: '', 
  StartedSession: false
  };
  bossProfileUrlImage: string = "";
  constructor(private router: Router, 
    private backgroundMode: BackgroundMode,
    private platform: Platform,
    private menuCtrl: MenuController,
    private angularFireDatabase:AngularFireDatabase,
    private angularFireStorage: AngularFireStorage,
    private generalSvc: GeneralService,
    private dataSvc:DatosService,
    private sanitizer: DomSanitizer) {
      LocalNotifications.requestPermission().then((hasPermission)=>{
        if(hasPermission.granted){
          this.checkIfRoleIsBoss();
        }
      });
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.exit();
      });
  }

  checkIfRoleIsBoss(): boolean
  {
    this.generalSvc.getLocalStorageData('role').then(role=>{
      if(role.value == 'boss')
      {
        this.getPendingNotificationsFromDb();
        return true;
      }
      return false;
    });
    return false;
  }

  setBackgroundMode()
  {
    this.backgroundMode.enable();
    this.backgroundMode.on('activate').subscribe(()=>{
      this.backgroundMode.overrideBackButton();
      this.backgroundMode.disableBatteryOptimizations();
      this.getPendingNotificationsFromDb();
    });
  }

  getSafeImage()
  {
    return this.sanitizer.sanitize(SecurityContext.STYLE, `url(${this.bossProfileUrlImage})`);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  ngOnInit() {  
    const bossDbObject: AngularFireObject<Boss> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Jefe'))
    
    bossDbObject.valueChanges().subscribe(bossData=>{
      if(bossData != null)
      {
        this.boss = bossData;
        
        const bossProfilePhotoDirectory = this.angularFireStorage.ref(bossData.Photo);

        bossProfilePhotoDirectory.getDownloadURL().subscribe(profilePhotoUrl=>{
          this.bossProfileUrlImage = profilePhotoUrl;
        });
      }
    });
    this.onClickNotifiaction();
    this.generalSvc.getLocalStorageData('role').then(role=>{
      if(role.value == 'boss')
      {
        this.getPendingNotificationsFromDb();
        window.addEventListener('beforeunload', () => {
          this.getPendingNotificationsFromDb();
          this.setBackgroundMode();
        });
      }
    });
  }

  onClickNotifiaction()
  {
    LocalNotifications.addListener('localNotificationActionPerformed', (localNotificationActionPerformed: LocalNotificationActionPerformed)=>{
      this.dataSvc.setInventoryKey(localNotificationActionPerformed.notification.extra.InventoryKey);
      this.dataSvc.setEmployeeCode(localNotificationActionPerformed.notification.extra.EmployeeCode);
      this.dataSvc.setBarKey(localNotificationActionPerformed.notification.extra.BarKey);
      this.dataSvc.setSubsidiary(localNotificationActionPerformed.notification.extra.SubsidiaryKey);
      this.dataSvc.setProductCode(localNotificationActionPerformed.notification.extra.ProductCode);
      this.router.navigate(['detalles-producto-jefe']);
    });
  }

  getPendingNotificationsFromDb() {
    this.generalSvc.getLocalStorageData('role').then(roleData=>{
      if(roleData.value == 'boss'){
        this.generalSvc.getLocalStorageData('barKey').then(barKey=>{
          if(barKey.value != null || barKey.value != ''){
            this.getEntryPendingNotifications();
            this.getExitPendingNotifications();
          }
        })
      }
    })
  }

  notificationSubscription: Subscription;
  getEntryPendingNotifications()
  {
    let counter = 0;
    const toNotificationsDbObject: AngularFireObject<Notification> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('ParaNotificacionesEntrada'));
    
    this.notificationSubscription = toNotificationsDbObject.snapshotChanges().subscribe(entryNotificationData=>{
      let dbEntryNotification = entryNotificationData.payload.val();
      for(let i in dbEntryNotification)
      {
        dbEntryNotification[i].Key = i;
        this.sendNotification(`${dbEntryNotification[i].EmployeeName}: Entrada`,
          `Sucursal: ${dbEntryNotification[i].SubsidiaryName}
Inventario: ${dbEntryNotification[i].InventoryName} 
Producto: ${dbEntryNotification[i].ProductName}`, counter, 
        { BarKey: dbEntryNotification[i].BarKey, 
          EmployeeCode: dbEntryNotification[i].EmployeeCode, 
          SubsidiaryKey: dbEntryNotification[i].SubsidiaryKey, 
          InventoryKey: dbEntryNotification[i].InventoryKey, 
          ProductCode: dbEntryNotification[i].ProductCode});
        counter++;
        this.angularFireDatabase.database.ref(`${this.generalSvc.getSpecificObjectRoute('ParaNotificacionesEntrada')}/${dbEntryNotification[i].Key}`)
        .remove();
      }
    });
  }

  getExitPendingNotifications()
  {
    let counter = 0;
    const toNotificationsDbObject: AngularFireObject<Notification>
    = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('ParaNotificacionesSalida'));
    
    toNotificationsDbObject.snapshotChanges().subscribe(exitNotificationData=>{
      let dbExitNotification = exitNotificationData.payload.val();
      for(let i in dbExitNotification)
      {
        dbExitNotification[i].Key = i;
        this.sendNotification(`${dbExitNotification[i].EmployeeName}: Salida`,
        `Sucursal: ${dbExitNotification[i].SubsidiaryName}
Inventario: ${dbExitNotification[i].InventoryName} 
Producto: ${dbExitNotification[i].ProductName}`, counter, 
        { BarKey: dbExitNotification[i].BarKey, 
          EmployeeCode: dbExitNotification[i].EmployeeCode, 
          SubsidiaryKey: dbExitNotification[i].SubsidiaryKey, 
          InventoryKey: dbExitNotification[i].InventoryKey, 
          ProductCode: dbExitNotification[i].ProductCode});
        counter++;
        this.angularFireDatabase.database.ref(`${this.generalSvc.getSpecificObjectRoute('ParaNotificacionesSalida')}/${dbExitNotification[i].Key}`)
        .remove();
      }
    });
  }

  async sendNotification(title:string, message:string, id: number, extraData: any){
    const notifications = await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: message,
          id: id,
          smallIcon:"ic_stat_background",
          attachments: null,
          actionTypeId: "",
          extra: extraData
        }
      ]
    });
  }

  exit()
  {
    this.generalSvc.presentAlertWithActions('Confirmar', '¿Estás seguro de querer salir?', 
    ()=>{
      this.router.navigate(['login']).then(()=>{
        this.generalSvc.clearLocalStorageData();
      });
    },
    ()=>{ this.generalSvc.closeAlert(); });
  }

  goToPage(page: string)
  {
    this.router.navigate([page]);
  }

  ngOnDestroy(): void {
   this.notificationSubscription.unsubscribe();
    
  }
}
