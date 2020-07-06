import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-inventarios',
  templateUrl: './control-inventarios.page.html',
  styleUrls: ['./control-inventarios.page.scss'],
})
export class ControlInventariosPage implements OnInit {

  ref: any;
  inventarios: any[]=[];
  constructor(private menuCtrl: MenuController,
    private datos: DatosService,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    this.ref = this.db.object(clave+'/Inventarios/'+cedula);
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
    this.menuCtrl.enable(true, 'second');
  }

  goToAdministracion(i:number)
  {
    this.datos.setKey(this.inventarios[i].key);
    this.router.navigate(['administracion-jefe'])
  }

}
