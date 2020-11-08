import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController } from '@ionic/angular';
import { Employee } from 'src/app/shared/models/Employee';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-detalles-empleado',
  templateUrl: './detalles-empleado.component.html',
  styleUrls: ['./detalles-empleado.component.scss'],
})
export class DetallesEmpleadoComponent implements OnInit {

  employee: Employee;
  constructor(private modalCtrl: ModalController,
    private generalSvc: GeneralService,
    private dataSvc: DatosService,
    private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {
    const employeeDbObject: AngularFireObject<Employee> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Empleado'));
    
    employeeDbObject.valueChanges().subscribe(employeeData=>{
      if(employeeData != null){
        this.employee = employeeData;
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
