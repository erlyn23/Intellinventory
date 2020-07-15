import { Component } from '@angular/core';
import { Platform, AlertController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectionService } from 'ng-connection-service';
import { GeneralService } from './services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';

 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  hayConexion: boolean;
  ref: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private conexion: ConnectionService,
  ) {
    this.initializeApp();
    this.checkConnection();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#0d2c42')
      this.splashScreen.hide();
    });
  }

  async alert(){
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Información',
      message: 'Error: No se ha detectado conexión a internet.',
      buttons:[
        {
          cssClass: 'ConfirmarEliminar',
          role: 'cancel',
          text: 'Aceptar',
          handler: ()=>{
          }
        }
      ]
    })
    await alert.present();
  }

  checkConnection(){
    this.conexion.monitor().subscribe(hayConexion=>{
      this.hayConexion = hayConexion;
      if(!this.hayConexion){
        this.alert();
      }else{
        console.log('hay conexión');
      }
    })
  }
}
