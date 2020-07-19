import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-empleado',
  templateUrl: './detalles-empleado.component.html',
  styleUrls: ['./detalles-empleado.component.scss'],
})
export class DetallesEmpleadoComponent implements OnInit {

  empleado: any = "";
  ref: any;
  constructor(private modalCtrl: ModalController,
    private datos: DatosService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    
    this.ref = this.db.object(clave+'/Empleados/'+cedula+'/DatosPersonales');
    this.ref.snapshotChanges().subscribe(data=>{
      let empleado = data.payload.val();
      this.empleado = "";
      if(empleado != null){
        this.empleado = empleado;
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
