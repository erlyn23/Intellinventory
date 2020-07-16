import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, MenuController, NavController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {

  titulo: any;
  estado: any;
  ref: any;
  productos: any[] = [];
  tempProducts: any[];
  esBusqueda: boolean = false;
  constructor(private navCtrl: NavController, 
    private menuCtrl: MenuController,
    private datos:DatosService,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario);
    this.ref.snapshotChanges().subscribe(data=>{
      let title = data.payload.val();
      if(title != null){
        this.titulo = title.NombreInventario;
        this.estado = title.Estado;
        this.datos.setEstado(this.estado);
      }
    });

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let products = data.payload.val();
      this.productos = [];
      for(let i in products)
      {
        products[i].key = i;
        this.productos.push(products[i]);
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'second');
  }

  buscarProducto(val:any)
  {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const sucursal = this.datos.getSucursal();

    this.esBusqueda = true;
    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let products = data.payload.val();
      this.tempProducts = [];
      for(let i in products)
      {
        if(products[i].Nombre.includes(val.detail.value))
        {
          this.tempProducts.push(products[i]);
        }else if(val.detail.value == "")
        {
          this.esBusqueda = false;
        }
      }
    });
  }

  goToDetails(i:number)
  {
    if(this.tempProducts != undefined)
    {
      this.datos.setCode(this.tempProducts[i].Codigo);
      this.router.navigate(['detalles-producto-jefe']);
    }else{
      this.datos.setCode(this.productos[i].Codigo);
      this.router.navigate(['detalles-producto-jefe'])
    } 
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
      this.router.navigate(['control-inventarios-jefe']);
    });
  }
}
