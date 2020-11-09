import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/Provider';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss'],
})
export class CrearProveedorComponent implements OnInit {

  form: FormGroup;
  provider: Provider;
  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private angularFireDatabase: AngularFireDatabase, 
    private dataSvc: DatosService,
    private generalSvc: GeneralService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Name: ["",[Validators.required]],
      Product: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      Cuantity: ["",[Validators.required]],
      PhoneNumber: ["",[Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]]
    });

    if(this.dataSvc.getProviderOperation() == 'modificar' && this.dataSvc.getProvider() != null)
    {
      this.provider = this.dataSvc.getProvider();
      
      this.Name.setValue(this.provider.Name);
      this.Cuantity.setValue(this.provider.Cuantity);
      this.Product.setValue(this.provider.Product);
      this.PhoneNumber.setValue(this.provider.PhoneNumber);
    }
  }

  saveProvider()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(this.generalSvc.getSpecificObjectRoute('Proveedores')).push({
        Name: this.Name.value,
        Product: this.Product.value,
        Cuantity: this.Cuantity.value,
        PhoneNumber: this.PhoneNumber.value
      }).then(()=>{
        this.generalSvc.presentToast('toastSuccess', 'Proveedor guardado correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.generalSvc.presentToast('customToast',err);
      })
    }
  }

  updateProvider()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(`${this.generalSvc.getSpecificObjectRoute('Proveedores')}/${this.provider.Key}`)
      .set({
        Name: this.Name.value,
        Product: this.Product.value,
        Cuantity: this.Cuantity.value,
        PhoneNumber: this.PhoneNumber.value
      }).then(()=>{
        this.generalSvc.presentToast('toastSuccess', 'Proveedor modificado correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.generalSvc.presentToast('customToast',err);
      })
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

  get Name(){
    return this.form.get('Name');
  }

  get Product(){
    return this.form.get('Product');
  }

  get Cuantity(){
    return this.form.get('Cuantity');
  }

  get PhoneNumber(){
    return this.form.get('PhoneNumber');
  }
}
