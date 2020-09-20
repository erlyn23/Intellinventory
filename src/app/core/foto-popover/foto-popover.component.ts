import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController, PopoverController, ModalController } from '@ionic/angular';
import { Plugins} from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase/app';
import { AlertPersonalizadoComponent } from '../alert-personalizado/alert-personalizado.component';

const { Storage } = Plugins;

@Component({
  selector: 'app-foto-popover',
  templateUrl: './foto-popover.component.html',
  styleUrls: ['./foto-popover.component.scss'],
})
export class FotoPopoverComponent implements OnInit {

  imagen: any;
  ref: any;
  constructor(private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private datos: DatosService,
    private servicio: GeneralService,
    private storage: AngularFireStorage) { }

  ngOnInit() {}


  async getPosicion()
  {
    return (await Storage.get({key: 'posicion'}));
  }

  subirImagen(datosImagen: any)
  {
    this.getPosicion().then(pos=>{
      if(pos.value == 'jefe')
      {
        const idJefe = this.datos.getClave();
        this.imagen = datosImagen.target.files[0];
        const rutaArchivo = `PerfilJefe/${idJefe}`;
        this.abrirAlert(rutaArchivo);
      }
      else
      {
        const cedula = this.datos.getCedula();
        this.imagen = datosImagen.target.files[0];
        const rutaArchivo = `Perfil/${cedula}`;
        this.abrirAlert(rutaArchivo);
      }
    });
  }

  async abrirAlert(ruta:any)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'customAlert',
      header: 'Confirmar',
      message: '¿Estás seguro de querer subir este archivo?',
      buttons:[
        {
          cssClass:'CancelarEliminar',
          role: 'confirm',
          text: 'Confirmar',
          handler: ()=>{
            this.cargando();
            this.guardarImagenEnLaBD(ruta);
          }
        },
        {
          cssClass:'ConfirmarEliminar',
          role: 'cancel',
          text: 'Cancelar',
          handler: ()=>{
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    return await alert.present();
  }

  async cargando(){
    const modal = await this.modalCtrl.create({
      cssClass: 'alertDisfrazado',
      component: AlertPersonalizadoComponent,
    });
    (await modal).present();
  }

  guardarImagenEnLaBD(ruta: string){
      this.getPosicion().then(pos=>{
        if(pos.value == 'jefe'){
          const referenciaArchivo = this.storage.ref(ruta);
          const tareaDeSubida = this.storage.upload(ruta, this.imagen);
          tareaDeSubida.percentageChanges().subscribe(porcentaje=>{
            if(porcentaje == 100)
            {
              const clave = this.datos.getClave();
              this.modalCtrl.dismiss();
              this.servicio.mensaje('toastSuccess', 'Imagen cambiada correctamente');
              this.servicio.insertarenlaBD(clave+'/Jefe/FotoPerfil',{Ruta: ''}).catch(err=>{
                this.servicio.mensaje('customToast',err);
              });
              this.servicio.insertarenlaBD(clave+'/Jefe/FotoPerfil',{Ruta: ruta}).catch(err=>{
                this.servicio.mensaje('customToast',err);
              });
              this.popoverCtrl.dismiss();
            }
          });
        }else{
          const referenciaArchivo = this.storage.ref(ruta);
          const tareaDeSubida = this.storage.upload(ruta, this.imagen);
          tareaDeSubida.percentageChanges().subscribe(porcentaje=>{
            if(porcentaje == 100)
            {
              const clave = this.datos.getClave();
              const cedula = this.datos.getCedula();
              this.modalCtrl.dismiss();
              this.servicio.mensaje('toastSuccess', 'Imagen cambiada correctamente');
              this.servicio.insertarenlaBD(clave+'/Empleados/'+cedula+'/FotoPerfil',{Ruta: ''}).catch(err=>{
                this.servicio.mensaje('customToast', err);
              });
              this.servicio.insertarenlaBD(clave+'/Empleados/'+cedula+'/FotoPerfil',{Ruta: ruta}).catch(err=>{
              this.servicio.mensaje('customToast',err);
            });
          this.popoverCtrl.dismiss();
        }
      });
      }
    })
  }
}
