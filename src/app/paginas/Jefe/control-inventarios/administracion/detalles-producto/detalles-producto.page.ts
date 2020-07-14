import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { NotasEntradaComponent } from 'src/app/paginas/Empleado/control-inventarios/administracion/detalles-producto/notas-entrada/notas-entrada.component';
import { NotasSalidaComponent } from 'src/app/paginas/Empleado/control-inventarios/administracion/detalles-producto/notas-salida/notas-salida.component';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.page.html',
  styleUrls: ['./detalles-producto.page.scss'],
})
export class DetallesProductoPage implements OnInit {

  producto: any = '';
  ref: any;
  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router,
    private db:AngularFireDatabase,
    private servicio: GeneralService,
    private datos: DatosService,) {
     }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const codigo = this.datos.getCode();
    
    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo);
    this.ref.snapshotChanges().subscribe(data=>{
      let product = data.payload.val();
      if(product != null){
        this.producto = product;
        this.producto.SumaEntrada = product.Entrada + product.CantidadInicial;
        this.producto.TotalExistencia = product.SumaEntrada - product.Salida;
        this.producto.Diferencia = product.InventarioActual - product.TotalExistencia;
        this.producto.Nota = product.Nota;
      }
    });
  }

  async abrirNotasEntrada()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: NotasEntradaComponent,
    });
    await modal.present();
  }

  async abrirNotasSalida()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: NotasSalidaComponent,
    });
    await modal.present();
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
        this.router.navigate(['administracion-jefe']);
      })
  }
}
