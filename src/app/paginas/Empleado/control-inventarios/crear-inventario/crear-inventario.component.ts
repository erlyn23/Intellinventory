import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-inventario',
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.scss'],
})
export class CrearInventarioComponent implements OnInit {

  form: FormGroup;
  constructor(private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private angularFireDatabase: AngularFireDatabase,
    private generalSvc: GeneralService,
    private dataSvc: DatosService) { }

  ngOnInit() {
    const date = new Date();

    this.form = this.formBuilder.group({
      Name: ["",[Validators.required, Validators.maxLength(30)]],
      Date: [`${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`],
    })
  }

  createInventory()
  {
    const barKey = this.dataSvc.getBarKey();
    const subsidiary = this.dataSvc.getSubsidiary();
    const employeeCode = this.dataSvc.getEmployeeCode();

    this.angularFireDatabase.database.ref(barKey+'/Sucursales/'+subsidiary+'/Inventarios/'+employeeCode).push({
      NombreInventario: this.Name.value,
      FechaInventario: this.Date.value,
      Estado: 'En progreso'
    }).then(()=>{
      this.generalSvc.presentToast('toastSuccess','Se ha creado el inventario');
      this.modalCtrl.dismiss();
    }).catch(err=>{
      this.generalSvc.presentToast('customToast', err);
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  get Name()
  {
    return this.form.get('Name');
  }

  get Date()
  {
    return this.form.get('Date');
  }
}
