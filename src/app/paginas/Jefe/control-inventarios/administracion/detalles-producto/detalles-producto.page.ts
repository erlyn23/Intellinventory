import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

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
    private servicio: GeneralService,
    private datos: DatosService,) { 
      PushNotifications.requestPermission().then(result=>{
        if(result.granted){
          PushNotifications.register();
        }
      })
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

    setInterval(()=>{
      this.chequearEntrada();
    }, 1000);
  }

  chequearEntrada(){
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const llaveInventario = this.datos.getKey();
    const codigo = this.datos.getCode();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+llaveInventario+'/Productos/'+codigo+'/Entrada');
    this.ref.snapshotChanges().subscribe(data=>{
      let product = data.payload.val();
      this.servicio.mensaje('toastSuccess', 'Me muestro cada 1 segundo');
      this.enviarNotificacion('Se ha hecho una entrada', 'Se ha hecho la entrada del producto');
    });
  }

  enviarNotificacion(titulo: any, mensaje: any){
    PushNotifications.addListener('registration',
    (token: PushNotificationToken) => {
      alert('Push registration success, token: ' + token.value);
    }
  );
  }

  goBack()
  {
    this.navCtrl.pop().then(()=>{
        this.router.navigate(['administracion-jefe']);
      })
  }
}
