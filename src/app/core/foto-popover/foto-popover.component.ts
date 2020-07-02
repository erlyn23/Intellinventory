import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-foto-popover',
  templateUrl: './foto-popover.component.html',
  styleUrls: ['./foto-popover.component.scss'],
})
export class FotoPopoverComponent implements OnInit {

  imagen: any;
  ref: any;
  constructor(private alertCtrl: AlertController,
    private popoverCtrl:PopoverController,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  ngOnInit() {}


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

  async abrirAlert(ruta:any)
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'confirmarSubir',
      header: 'Confirmar',
      message: '¿Estás seguro de querer subir este archivo?',
      buttons:[
        {
          cssClass:'Confirmar',
          role: 'confirm',
          text: 'Confirmar',
          handler: ()=>{
            const fileRef = this.storage.ref(ruta);
            const tarea = this.storage.upload(ruta, this.imagen);
            tarea.percentageChanges().subscribe(porcent=>{
              if(porcent == 100)
              {
                const clave = this.datos.getClave();
                const cedula = this.datos.getCedula();
                this.servicio.mensaje('toastSuccess', 'Imagen cambiada correctamente');
                this.servicio.insertarenlaBD(clave+'/Empleados/'+cedula+'/FotoPerfil',{Ruta: ruta}).catch(err=>{
                  this.servicio.mensaje('customToast',err);
                });
                this.popoverCtrl.dismiss();
              }
            });
            this.obtenerPerfil();
          }
        },
        {
          cssClass:'Cancelar',
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

  subirImagen(ev: any)
  {
    const cedula = this.datos.getCedula();
    this.imagen = ev.target.files[0];
    const rutaArchivo = `Perfil/${cedula}`;
    this.abrirAlert(rutaArchivo);
  }

}
