import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, MenuController, NavController, AlertController, Platform } from '@ionic/angular';
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
  productosTemporales: any[];
  esBusqueda: boolean = false;
  constructor(private modalCtrl: ModalController,
    private platform: Platform,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos:DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private router: Router) {
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.goBack();
      })
     }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const sucursal = this.datos.getSucursal();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario);
    this.ref.snapshotChanges().subscribe(data=>{
      let infoInventario = data.payload.val();
      if(infoInventario != null){
        this.titulo = infoInventario.NombreInventario;
        this.estado = infoInventario.Estado;
        this.datos.setEstado(this.estado);
      }
    });

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let bdProductos = data.payload.val();
      this.productos = [];
      for(let i in bdProductos)
      {
        bdProductos[i].key = i;
        this.productos.push(bdProductos[i]);
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

  async confirmarEliminarProducto(indice: number){
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
            this.eliminarProducto(indice);
          }
        }
      ]
    });
    await alert.present();
  }

  eliminarProducto(indice: number){
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const producto = this.productos[indice].Codigo;

    this.db.database.ref(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+producto)
    .remove().then(()=>{
      this.servicio.mensaje('toastSuccess', 'Se ha eliminado el producto');
    }).catch((err)=>{
      this.servicio.mensaje('toastCustom',err);
    });
  }

  buscarProducto(busqueda:any)
  {
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

    this.esBusqueda = true;
    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let bdProductos = data.payload.val();
      this.productosTemporales = [];
      for(let i in bdProductos)
      {
        if(bdProductos[i].Nombre.includes(busqueda.detail.value))
        {
          this.productosTemporales.push(bdProductos[i]);
        }else if(busqueda.detail.value == "")
        {
          this.esBusqueda = false;
        }
      }
    });
  }

  async confirmarFinalizarInventario(){
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
              this.finalizarInventario();
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

  finalizarInventario(){
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

  exportarAexcel()
  {
    this.servicio.exportarExcel(this.productos, 'Inventario');
  }

  goToDetails(indice:number)
  {
    if(this.productosTemporales != undefined)
    {
      this.datos.setCode(this.productosTemporales[indice].Codigo);
      this.router.navigate(['detalles-producto']);
    }else{
      this.datos.setCode(this.productos[indice].Codigo);
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
