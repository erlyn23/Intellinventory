import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-modal-crear',
  templateUrl: './modal-crear.component.html',
  styleUrls: ['./modal-crear.component.scss'],
})
export class ModalCrearComponent implements OnInit {

  form: FormGroup;
  constructor(private angularFireDatabase: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private generalSvc: GeneralService,
    private dataSvc: DatosService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Code: ["",[Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*')]],
      Name: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    })
  }

  saveEmployee(){
    const name = this.Name.value;
    const employeeCode = this.Code.value;
    this.angularFireDatabase.database.ref('EmpleadosActivos/'+employeeCode).set({
      ActivationCode: this.dataSvc.getEmployeeCode(),
    });

    this.generalSvc.insertDataInDb(`${this.generalSvc.getSpecificObjectRoute('Empleados')}/${employeeCode}`, 
    {EmployeeCode: employeeCode, Name: name}).then(()=>{
      this.generalSvc.presentToast('toastSuccess', 'El empleado se ha guardado correctamente');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.generalSvc.presentToast('customToast',err);
    });
  }

  close(){
    this.modalCtrl.dismiss();
  }

  get Code(){
    return this.form.get('Code');
  }

  get Name(){
    return this.form.get('Name');
  }
}
