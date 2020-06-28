import { Component, OnInit, Input } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() origen: any;
  constructor(private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private router: Router) { }

  ngOnInit() {}

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
            this.limpiarUser();
            this.router.navigate(['login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async limpiarUser()
  {
    return (await Storage.clear());
  }

  goToHome()
  {
    this.router.navigate(['dashboard'])
    .then(()=>{
      this.menuCtrl.toggle();
    }).catch(err=>{
      console.log(err);
    })
  }

  goToControl()
  {
    this.router.navigate(['control-inventarios'])
    .then(()=>{
      this.menuCtrl.toggle();
    }).catch(err=>{
      console.log(err);
    })
  }
}
