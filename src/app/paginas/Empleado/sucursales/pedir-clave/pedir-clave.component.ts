import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosService } from 'src/app/services/datos.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-pedir-clave',
  templateUrl: './pedir-clave.component.html',
  styleUrls: ['./pedir-clave.component.scss'],
})
export class PedirClaveComponent implements OnInit {

  formulario: FormGroup;
  ref: any;
  constructor(private modalCtrl: ModalController, 
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Password: ["",[Validators.required, Validators.maxLength(12), Validators.minLength(6)]]
    })
  }

  entrar(){
    const claveBar = this.datos.getClave();
    const sucursalA = this.datos.getSucursal();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursalA);
    this.ref.snapshotChanges().subscribe(data=>{
      let sucursal = data.payload.val();
      if(sucursal != null){
        if(this.formulario.value.Password == sucursal.Password){
          this.datos.setSucursal(sucursalA);
          this.router.navigate(['control-inventarios']);
          this.modalCtrl.dismiss();
        }else{
          this.servicio.mensaje('customToast', 'Clave incorrecta')
        }
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

  get Password(){
    return this.formulario.get('Password')
  }
}
