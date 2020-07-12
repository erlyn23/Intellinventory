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
    private popoverCtrl:PopoverController,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage, 
    private camera: Camera) { }

  ngOnInit() {}


  async getPosicion()
  {
    return (await Storage.get({key: 'posicion'}));
  }

  // obtenerPerfil()
  // {
  //   this.getPosicion().then(pos=>{
  //     if(pos.value == 'jefe'){
  //       const clave = this.datos.getClave();

  //       this.ref = this.db.object(clave+'/Jefe/FotoPerfil');
  //       this.ref.snapshotChanges().subscribe(data=>{
  //         let foto = data.payload.val();
  //         const directorioFoto = this.storage.ref(foto.Ruta);
  //         directorioFoto.getDownloadURL().subscribe(url=>{
  //           this.imagen = url;
  //         })
  //       })
        
  //     }else{
  //       const clave = this.datos.getClave();
  //       const cedula = this.datos.getCedula();
    
  //       this.ref = this.db.object(clave+'/Empleados/'+cedula+'/FotoPerfil');
  //       this.ref.snapshotChanges().subscribe(data=>{
  //         let foto = data.payload.val();
  //         const directorioFoto = this.storage.ref(foto.Ruta);
  //         directorioFoto.getDownloadURL().subscribe(url=>{
  //           this.imagen = url;
  //         })
  //       })
  //     }
  //   })
  // }

  tomarFoto(){
    const options: CameraOptions ={
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(imageData=>{
      let base64 = 'data:image/jpeg; base64,'+imageData;
      this.getPosicion().then(pos=>{
        if(pos.value == 'jefe'){
          const uid = this.datos.getClave();
          const storageRef = firebase.storage().ref().child(`PerfilJefe/${uid}`).putString(base64, firebase.storage.StringFormat.DATA_URL)
          .then(()=>{
            this.db.database.ref(uid+'/Jefe/FotoPerfil').set({
              Ruta: `PerfilJefe/${uid}`
            }).then(()=>{
              this.servicio.mensaje('toastSuccess', 'Foto subida correctamente');
              this.popoverCtrl.dismiss();
            })
          }).catch(err=>{
            this.servicio.mensaje('customToast', err);
          })
        }else{
          const clave = this.datos.getClave();
          const cedula = this.datos.getCedula();
          const storageRef = firebase.storage().ref().child(`Perfil/${cedula}`).putString(base64, firebase.storage.StringFormat.DATA_URL)
          .then(()=>{
            this.db.database.ref(clave+'/Empleados/'+cedula+'/FotoPerfil').set({
              Ruta: `Perfil/${cedula}`
            }).then(()=>{
              this.servicio.mensaje('toastSuccess', 'Foto subida correctamente');
              this.popoverCtrl.dismiss();
            })
          }).catch(err=>{
            this.servicio.mensaje('customToast', err);
          })
        }
        
      })
      
    })
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
            this.getPosicion().then(pos=>{
              if(pos.value == 'jefe'){
                const fileRef = this.storage.ref(ruta);
                const tarea = this.storage.upload(ruta, this.imagen);
                tarea.percentageChanges().subscribe(porcent=>{
                  if(porcent == 100)
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
               // this.obtenerPerfil();
              }else{
                const fileRef = this.storage.ref(ruta);
                const tarea = this.storage.upload(ruta, this.imagen);
                tarea.percentageChanges().subscribe(porcent=>{
                  if(porcent == 100)
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
            //this.obtenerPerfil();
              }
            })
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

  subirImagen(ev: any)
  {
    this.getPosicion().then(pos=>{
      if(pos.value == 'jefe')
      {
        const uid = this.datos.getClave();
        this.imagen = ev.target.files[0];
        const rutaArchivo = `PerfilJefe/${uid}`;
        this.abrirAlert(rutaArchivo);
      }else{
        const cedula = this.datos.getCedula();
        this.imagen = ev.target.files[0];
        const rutaArchivo = `Perfil/${cedula}`;
        this.abrirAlert(rutaArchivo);
      }
    })
  }

}
