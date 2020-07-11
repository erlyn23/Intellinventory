import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { EntradaComponent } from './entrada/entrada.component';
import { SalidaComponent } from './salida/salida.component';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InventarioActualComponent } from './inventario-actual/inventario-actual.component';
import { NotasComponent } from './notas/notas.component';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.page.html',
  styleUrls: ['./detalles-producto.page.scss'],
})
export class DetallesProductoPage implements OnInit {

  producto: any = '';
  ref: any;
  guardado: boolean = false;
  estado: any;
  stock:any;
  constructor(private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private db:AngularFireDatabase,
    private datos: DatosService,
    private servicio: GeneralService) { }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const codigo = this.datos.getCode();
    
    this.ref = this.db.object(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo);
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
    this.estado = this.datos.getEstado();
    this.setStocks(codigo);
  }

  setStocks(codigo: any)
  { 
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    this.ref = this.db.object(clave+'/Stock/'+cedula+'/'+codigo);
    this.ref.snapshotChanges().subscribe(data=>{
      let stock = data.payload.val();
      if(stock != null)
      {
        this.stock = stock;
        this.abrirConfirmar(`Tenemos información de stock de esta mercancía, se compra por defecto una cantidad de ${this.stock.Cantidad} unidades.`)
      }
    });
  }

  async abrirConfirmar(mensaje:any)
  {
    const alert = await this.alertCtrl.create({
      cssClass:'customAlert',
      header: 'Información',
      message: mensaje,
      buttons:[
        {
          cssClass:'CancelarEliminar',
          role: 'cancel',
          text: 'Aceptar',
          handler: ()=>{ 
            this.alertCtrl.dismiss();
          }
        },
      ]
    });
    await alert.present();
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

  async abrirInventarioActual()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: InventarioActualComponent,
    });
    await modal.present();
  }

  async abrirNotas()
  {
    const modal = await this.modalCtrl.create({
      cssClass:'customModal',
      component: NotasComponent,
    });
    await modal.present();
  }


  guardarCambios()
  {
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const codigo = this.datos.getCode();

    this.db.database.ref(claveBar+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo).update({
      SumaEntrada: this.producto.SumaEntrada,
      TotalExistencia: this.producto.TotalExistencia,
      Diferencia: this.producto.Diferencia,
      Nota: this.producto.Nota
    }).then(()=>{
      this.servicio.mensaje('toastSuccess','Cambios guardados correctamente');
      this.guardado = true;
    });
  }

  goBack()
  {
    if(!this.guardado && this.estado != 'Finalizado')
    {
      this.abrirConfirmar('Aún no guardas los cambios, aunque puedas verlos debes guardarlos.');
    }else{
      this.navCtrl.pop().then(()=>{
        this.router.navigate(['administracion']);
      })
    }
  }

}
