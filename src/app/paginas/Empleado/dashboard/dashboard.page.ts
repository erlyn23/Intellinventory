import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';

const { Storage } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  nombre: any;
  ref: any;
  imagen: any;
  constructor(private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private datos: DatosService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  ngOnInit() { 
    const cedula = this.datos.getCedula();
    const clave = this.datos.getClave();
    this.ref = this.db.object(clave + '/Empleados/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.nombre = nombre.Nombre;
    });
    this.obtenerPerfil();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  
  obtenerPerfil()
  {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.ref = this.db.object(clave+'/Empleados/'+cedula+'/FotoPerfil');
    this.ref.snapshotChanges().subscribe(data=>{
      let foto = data.payload.val();
      const directorioFoto = this.storage.ref(foto.Ruta);
      directorioFoto.getDownloadURL().subscribe(url=>{
        this.imagen = url;
      })
    })
  }

  async salir()
  {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de querer salir?',
      cssClass: 'customAlert',
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
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'ConfirmarEliminar',
          handler: ()=>{
            this.limpiarUser();
            this.router.navigate(['login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async limpiarUser()
  {
    return (await Storage.clear());
  }

  goToPage(pagina: any)
  {
    switch(pagina)
    {
      case 'ctrlInventario':
      this.router.navigate(['control-inventarios']);
      break;
      case 'stock':
        //Aquí va la Stock
      break;
      case 'proveedores':
        //Aquí van los proveedores
      break;
      case 'calculadora':
        this.router.navigate(['calculadora']);
      break;
      case 'editar':
        this.router.navigate(['editar-perfil']);
      break;
      case 'salir':
        this.salir();
      break;
    }
  }

}
