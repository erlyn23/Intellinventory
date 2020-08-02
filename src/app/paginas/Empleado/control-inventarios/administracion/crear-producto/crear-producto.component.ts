import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
})
export class CrearProductoComponent implements OnInit {

  form: FormGroup;
  constructor(private modalCtrl: ModalController, private datos: DatosService,
    private servicio: GeneralService,
    private formBuilder: FormBuilder,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Codigo: ["",[Validators.required]],
      Nombre: ["",[Validators.required, Validators.maxLength(30)]],
      CantidadInicial: ["",[Validators.required]]
    })
  }

  crearProducto(){
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

    if(this.form.valid){
      this.servicio.insertarenlaBD(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+this.form.value.Codigo,
      {
        Codigo: this.form.value.Codigo,
        Nombre: this.form.value.Nombre,
        CantidadInicial: this.form.value.CantidadInicial,
        Entrada: 0,
        SumaEntrada: 0,
        Salida: 0,
        TotalExistencia: 0,
        InventarioActual: 0,
        Diferencia: 0,
        Nota: ''
      }).then(()=>{
        this.servicio.mensaje('toastSuccess','Se ha creado el producto correctamente');
        this.modalCtrl.dismiss();
      })
    }
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  leerCodigo(){
    this.servicio.leerCodigo().then(async (codigo)=>{

      let code = await Clipboard.read(); 
      this.form.controls.Codigo.setValue(code.value);
    })
    
    this.servicio.mensaje('toastSuccess', 'Código leído, pegue el código en el campo.')
  }
}
