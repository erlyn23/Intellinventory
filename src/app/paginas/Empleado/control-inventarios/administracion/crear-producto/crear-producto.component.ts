import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
})
export class CrearProductoComponent implements OnInit {

  form: FormGroup;
  constructor(private generalSvc: GeneralService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Code: ["",[Validators.required]],
      Name: ["",[Validators.required, Validators.maxLength(30)]],
      InitialCuantity: ["",[Validators.required]]
    })
  }

  createProduct(){
    if(this.form.valid){
      this.generalSvc.insertDataInDb(`${this.generalSvc.getSpecificObjectRoute('Productos')}/${this.form.value.Code}`,
      {
        Code: this.form.value.Code,
        Name: this.form.value.Name,
        InitialCuantity: this.form.value.InitialCuantity,
        Entry: 0,
        EntrySum: 0,
        Exit: 0,
        TotalExistence: 0,
        ActualInventory: 0,
        Difference: 0,
        FinalNote: ''
      }).then(()=>{
        this.generalSvc.presentToast('toastSuccess','Se ha creado el producto correctamente');
        this.generalSvc.closeModal();
      })
    }
  }

  goBack(){
    this.generalSvc.closeModal();
  }

  readBarCode(){
    this.generalSvc.readBarCode().then(async (codigo)=>{

      let barCode = await Clipboard.read(); 
      this.form.controls.Codigo.setValue(barCode.value);
    })
    
    this.generalSvc.presentToast('toastSuccess', 'Código leído, pegue el código en el campo.')
  }
}
