import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { EntradaComponent } from './entrada/entrada.component';
import { SalidaComponent } from './salida/salida.component';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {

  titulo: any;
  ref: any;
  productos: any[];
  tempProducts: any[];
  esBusqueda: boolean = false;
  constructor(private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private datos:DatosService,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

    this.ref = this.db.object(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario);
    this.ref.snapshotChanges().subscribe(data=>{
      let title = data.payload.val();
      this.titulo = title.NombreInventario;
    });

    this.ref = this.db.object(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let products = data.payload.val();
      this.productos = [];
      for(let i in products)
      {
        products[i].key = i;
        this.productos.push(products[i].Nombre);
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'first');
  }

  async abrirEntrada()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: EntradaComponent,
    });
    await modal.present();
  }
  async abrirSalida()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: SalidaComponent,
    });
    await modal.present();
  }
  algo:string = "Esto es un texto";
  buscarProducto(val:any)
  {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();

    this.esBusqueda = true;
    this.ref = this.db.object(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos');
    this.ref.snapshotChanges().subscribe(data=>{
      let products = data.payload.val();
      this.tempProducts = [];
      for(let i in products)
      {
        if(products[i].Nombre.includes(val.detail.value))
        {
          this.tempProducts.push(products[i].Nombre);
        }else if(val.detail.value == "")
        {
          this.esBusqueda = false;
        }
      }
    });
  }

  goBack()
  {
    this.router.navigate(['control-inventarios']);
  }
}
