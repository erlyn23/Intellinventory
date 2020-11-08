import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { DatosService } from 'src/app/services/datos.service';
import { DetallesEmpleadoComponent } from './detalles-empleado/detalles-empleado.component';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {
  
  employees: Employee[];
  constructor(private router: Router, 
    private menuCtrl: MenuController,
    private angularFireDatabase:AngularFireDatabase,
    private generalSvc: GeneralService,
    private dataSvc:DatosService) {
    }

  ngOnInit() {
    const employeesDbObject: AngularFireObject<Employee> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Empleados'));
    
    employeesDbObject.snapshotChanges().subscribe(employeeData=>{
      let dbEmployees = employeeData.payload.val();
      this.employees = [];
      for(let i in dbEmployees)
      {
        this.employees.push(dbEmployees[i]);
      }
    })
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  openCreateEmployeeModal()
  {
    this.generalSvc.openModal(ModalCrearComponent);
  }

  openEmployeeDetailsModal(employeeIndex:number)
  {
    this.dataSvc.setEmployeeCode(this.employees[employeeIndex].Code);
    this.generalSvc.openModal(DetallesEmpleadoComponent);
  }

  confirmDeleteEmployee(employeeIndex: number){
    
    this.generalSvc.presentAlertWithActions('Confirmar', 
    '¿Estás seguro de querer eliminar este empleado? No podrás recuperarlo',
    ()=>{ this.deleteEmployee(employeeIndex); }, ()=>{ this.generalSvc.closeAlert(); });
  }

  deleteEmployee(employeeIndex: number)
  {
    this.angularFireDatabase.database
    .ref(`${this.generalSvc.getSpecificObjectRoute('EmpleadosActivos')}/${this.employees[employeeIndex].Code}`)
    .remove();
    this.angularFireDatabase.database
    .ref(`${this.generalSvc.getSpecificObjectRoute('Empleados')}/${this.employees[employeeIndex].Code}`)
    .remove()
    .then(()=>{
      this.generalSvc.presentToast('toastSuccess', 'Se ha eliminado el empleado');
      this.router.navigate(['dashboardjefe'])
    }).catch((err)=>{
      this.generalSvc.presentToast('toastCustom',err);
    });
  }
}
