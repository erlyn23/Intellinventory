import { Component, OnInit } from '@angular/core';
import { MenuController, PopoverController, ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FotoPopoverComponent } from './../../../core/foto-popover/foto-popover.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';

@Component({
  selector: 'app-editar-perfil-jefe',
  templateUrl: './editar-perfil-jefe.page.html',
  styleUrls: ['./editar-perfil-jefe.page.scss'],
})
export class EditarPerfilJefePage implements OnInit {

  form: FormGroup;
  ref: any;
  imagen: any = "";
  constructor(private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController, 
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    const clave = this.datos.getClave();

    this.form = this.formBuilder.group({
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Telefono: ["",[Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      Empresa: [""]
    });
    this.ref = this.db.object(clave+'/Jefe/DatosPersonales');
    this.ref.snapshotChanges().subscribe(data=>{
      let datos = data.payload.val();
      if(datos != null)
      {
        this.form.controls.Nombre.setValue(datos.Nombre);
        this.form.controls.Telefono.setValue(datos.Telefono);
        this.form.controls.Empresa.setValue(datos.Empresa);
      }
    });
    this.obtenerPerfil();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'second');
  }

  obtenerPerfil()
  {
    const clave = this.datos.getClave();

    this.ref = this.db.object(clave+'/Jefe/FotoPerfil');
    this.ref.snapshotChanges().subscribe(data=>{
      let foto = data.payload.val();
      this.imagen = "";
      if(foto != null)
      {
        const directorioFoto = this.storage.ref(foto.Ruta);
        directorioFoto.getDownloadURL().subscribe(url=>{
        this.imagen = url;
        })
      }
    })
  }

  async abrirPopover()
  {
    const popover = await this.popoverCtrl.create({
      cssClass: 'customPopover',
      component: FotoPopoverComponent,
      translucent: true,
    });
    return (await popover.present());
  }

  async abrirCambioPass()
  {
    const modal = await this.modalCtrl.create({
      cssClass: 'customModal',
      component: CambiarPasswordComponent
    });
    await modal.present();
  }

  guardarPerfil()
  {
    if(this.form.valid)
    {
      const clave = this.datos.getClave();
      this.db.database.ref(clave+'/Jefe/DatosPersonales').set({
        Nombre: this.form.value.Nombre,
        Telefono: this.form.value.Telefono,
        Empresa: this.form.value.Empresa
      }).then(()=>{
        this.servicio.mensaje('toastSuccess', 'Cambios guardados correctamente');
      }).catch(err=>{
        this.servicio.mensaje('customToast',err);
      });
    }
  }

  get Nombre(){
    return this.form.get('Nombre');
  }

  get Telefono(){
    return this.form.get('Telefono');
  }
  
  get Correo(){
    return this.form.get('Correo');
  }

}
