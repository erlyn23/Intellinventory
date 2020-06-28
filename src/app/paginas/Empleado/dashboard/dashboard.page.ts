import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private menuCtrl: MenuController,
    private datos: DatosService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

}
