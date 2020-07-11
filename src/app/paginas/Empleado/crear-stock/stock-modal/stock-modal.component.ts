import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stock-modal',
  templateUrl: './stock-modal.component.html',
  styleUrls: ['./stock-modal.component.scss'],
})
export class StockModalComponent implements OnInit {

  formulario: FormGroup;
  ref: any;
  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private db: AngularFireDatabase, 
    private datos: DatosService,
    private servicio: GeneralService) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Codigo: ["",[Validators.required]],
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      Cantidad: ["",[Validators.required]]
    })
  }

  buscarStock(val:any){
    this.ref = this.db.object(this.datos.getClave()+'/Stock/'+this.datos.getCedula()+'/'+val.detail.value);
    this.ref.snapshotChanges().subscribe(data=>{
      let prod = data.payload.val();
      if(prod != null)
      {
        this.formulario.controls.Nombre.setValue(prod.Nombre);
        this.formulario.controls.Cantidad.setValue(prod.Cantidad);
      }else{
        this.formulario.controls.Nombre.setValue("");
        this.formulario.controls.Cantidad.setValue("");
      }
    })
  }

  guardarStock()
  {
    if(this.formulario.valid)
    {
      const clave = this.datos.getClave();
      const cedula = this.datos.getCedula();
      this.db.database.ref(clave+'/Stock/'+cedula+'/'+this.formulario.value.Codigo).set({
        Codigo: this.formulario.value.Codigo,
        Nombre: this.formulario.value.Nombre,
        Cantidad: this.formulario.value.Cantidad
      }).then(()=>{
        this.servicio.mensaje('toastSuccess', 'Stock guardado correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.servicio.mensaje('customToast',err);
      })
    }
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

  get Codigo(){
    return this.formulario.get('Codigo');
  }

  get Nombre(){
    return this.formulario.get('Nombre');
  }

  get Cantidad(){
    return this.formulario.get('Cantidad');
  }

}
