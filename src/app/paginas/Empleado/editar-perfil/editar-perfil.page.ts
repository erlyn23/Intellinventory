import { Component, OnInit } from '@angular/core';
import { MenuController, PopoverController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FotoPopoverComponent } from './../../../core/foto-popover/foto-popover.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  form: FormGroup;
  ref: any;
  imagen: any = "";
  constructor(private menuCtrl: MenuController,
    private popoverCtrl: PopoverController, 
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.form = this.formBuilder.group({
      Nombre: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Edad: ["",[Validators.required]],
      Telefono: ["",[Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      Correo: ["", [Validators.email]]
    });
    this.ref = this.db.object(clave+'/Empleados/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let datos = data.payload.val();
      this.form.controls.Nombre.setValue(datos.Nombre);
      this.form.controls.Edad.setValue(datos.DatosPersonales.Edad);
      this.form.controls.Telefono.setValue(datos.DatosPersonales.Telefono);
      this.form.controls.Correo.setValue(datos.DatosPersonales.Correo);
    });
    this.obtenerPerfil();
  }

  obtenerPerfil()
  {
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.ref = this.db.object(clave+'/Empleados/'+cedula+'/FotoPerfil');
    this.ref.snapshotChanges().subscribe(data=>{
      let foto = data.payload.val();
      this.imagen = "";
      const directorioFoto = this.storage.ref(foto.Ruta);
      directorioFoto.getDownloadURL().subscribe(url=>{
        this.imagen = url;
      })
    })
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
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


  guardarPerfil()
  {
    if(this.form.valid)
    {
      const clave = this.datos.getClave();
      const cedula = this.datos.getCedula();
      this.db.database.ref(clave+'/Empleados/'+cedula+'/DatosPersonales').set({
        Nombre: this.form.value.Nombre,
        Edad: this.form.value.Edad,
        Telefono: this.form.value.Telefono,
        Correo: this.form.value.Correo
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

  get Edad(){
    return this.form.get('Edad');
  }

  get Telefono(){
    return this.form.get('Telefono');
  }
  
  get Correo(){
    return this.form.get('Correo');
  }

}
