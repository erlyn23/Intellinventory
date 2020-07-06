import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.page.html',
  styleUrls: ['./detalles-producto.page.scss'],
})
export class DetallesProductoPage implements OnInit {

  producto: any = '';
  ref: any;
  constructor(private navCtrl: NavController,
    private router: Router,
    private db:AngularFireDatabase,
    private datos: DatosService,) { }

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
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
        this.router.navigate(['administracion-jefe']);
      })
  }
}
