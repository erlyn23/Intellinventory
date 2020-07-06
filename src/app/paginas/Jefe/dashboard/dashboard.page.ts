import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, MenuController, NavController } from '@ionic/angular';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  empleados: any[];
  ref:any;
  constructor(private router: Router, 
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private db:AngularFireDatabase,
    private servicio: GeneralService,
    private datos:DatosService) { }

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
    this.router.navigate(['control-inventarios-jefe']);
  }


  goToCreateEmployee(){
    this.abrirModal();
  }

}
