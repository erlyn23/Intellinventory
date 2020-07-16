import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, MenuController, NavController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { ImportarProductosComponent } from './importar-productos/importar-productos.component';

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
  constructor(private modalCtrl: ModalController,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const sucursal = this.datos.getSucursal();

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
    this.menuCtrl.enable(false, 'first');
  }

  async abrirCrear()
  {
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: CrearProductoComponent
    });
    await modal.present();
  }

  async abrirImportar()
  {
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: ImportarProductosComponent
    });
    await modal.present();
  }

  async abrirAlert(i: number){
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de querer eliminar este producto? No podrás recuperarlo',
      buttons:
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'CancelarEliminar',
          handler: ()=>{
            this.alertCtrl.dismiss();
          }
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'ConfirmarEliminar',
          handler: ()=>{
            const claveBar = this.datos.getClave();
            const sucursal = this.datos.getSucursal();
            const cedula = this.datos.getCedula();
            const llaveInventario = this.datos.getKey();

            this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+this.productos[i].Codigo)
            .remove().then(()=>{
              this.servicio.mensaje('toastSuccess', 'Se ha eliminado el producto');
            }).catch((err)=>{
              this.servicio.mensaje('toastCustom',err);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  buscarProducto(val:any)
  {
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

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

  async finalizarInventario(){
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de finalizar el inventario? Una vez hecho esto no podrás hacer nada para revertirlo.',
      buttons:[
        {
          cssClass: 'CancelarEliminar',
          text: 'Confirmar',
          role: 'confirm',
          handler: ()=>{
              const cedula = this.datos.getCedula();
              const clave = this.datos.getClave();
              const llave = this.datos.getKey();
              const sucursal = this.datos.getSucursal();
              
              this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llave).update({Estado: 'Finalizado'})
              .then(()=>{
                this.servicio.mensaje('toastSuccess','Inventario finalizado correctamente');
                this.goBack();
              });
          }
        },
        {
          cssClass:'ConfirmarEliminar',
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  exportarAexcel()
  {
    this.servicio.exportarExcel(this.productos, 'Inventario');
  }

  goToDetails(i:number)
  {
    if(this.tempProducts != undefined)
    {
      this.datos.setCode(this.tempProducts[i].Codigo);
      this.router.navigate(['detalles-producto']);
    }else{
      this.datos.setCode(this.productos[i].Codigo);
      this.router.navigate(['detalles-producto'])
    } 
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
      this.router.navigate(['control-inventarios']);
    });
  }
}
