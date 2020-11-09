import { Component } from '@angular/core';
import { Platform, AlertController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(private platform: Platform,
    private autostart: Autostart,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private connectionService: ConnectionService,
  ) {this.initializeApp();
    this.checkConnection();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.autostart.enable();
      this.statusBar.backgroundColorByHexString('#0d2c42');
      this.splashScreen.hide();
    });
  }

  checkConnection(){
    this.connectionService.monitor().subscribe(hasConnection=>{
      if(!hasConnection){
        this.sendConnectionStatusMessage();
      }
    })
  }

  async sendConnectionStatusMessage(){
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

}
