import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-importar-productos',
  templateUrl: './importar-productos.component.html',
  styleUrls: ['./importar-productos.component.scss'],
})
export class ImportarProductosComponent implements OnInit {

  formulario: FormGroup;
  ref: any;
  inventarios: any[] = [];
  productos: any[] = [];
  constructor(private modalCtrl: ModalController, 
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private db: AngularFireDatabase) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      Inventarios: [""]
    })

    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let inventarios = data.payload.val();
      this.inventarios = [];
      for(let i in inventarios){
        inventarios[i].key = i;
        this.inventarios.push(inventarios[i]);
      }
    })
  }

  buscarProductos(busqueda:any){
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+busqueda.detail.value+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let productos = data.payload.val();
      this.productos = [];
      for(let i in productos){
        productos[i].key = i;
        this.productos.push(productos[i]);
      }
    })
  }

  importarProductos(){
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const inventario = this.datos.getKey();
    
    for(let i in this.productos)
    {
      let producto = this.productos[i].Codigo;
      this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto).update({
        Codigo: producto.Codigo,
        Nombre: producto.Nombre,
        CantidadInicial: producto.InventarioActual,
        Entrada: 0,
        SumaEntrada: producto.SumaEntrada,
        Salida: 0,
        TotalExistencia: producto.TotalExistencia,
        InventarioActual: 0,
        Diferencia: producto.Diferencia,
        Nota: producto.Nota
      })
    }
    this.modalCtrl.dismiss();
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
