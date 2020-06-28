import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Plugins } from '@capacitor/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  Posicion: any;
  seleccionado: number = 0;
  ref: any;
  jefe: any = {correo: '', password: '', sesionIniciada: false};
  empleado: any = {codigo: null, sesionIniciada: false};
  encontrado: number = 0;

  constructor(private menuCtrl: MenuController,
    private servicio: GeneralService,
    private datos: DatosService,
    private auth:AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.clearUsuario();
    this.encontrado = 0;
    this.menuCtrl.enable(false);
      this.getUsuario('posicion').then(pos=>{
        if(pos.value == 'jefe')
        {
          this.getUsuario('usuario').then(usr=>{
            this.getUsuario('password').then(pss=>{
              if(usr.value != null && pss.value != null){
                this.auth.signInWithEmailAndPassword(usr.value, pss.value).then(()=>{
                  this.auth.currentUser.then(usr=>{
                    this.datos.setClave(usr.uid);
                    this.router.navigate(['dashboardjefe']);
                  });
                });
              }
            })
          }).catch((err)=>{
            this.servicio.mensaje('customToast',err);
          })
        }else if(pos.value == 'empleado')
        {
          this.getUsuario('cedula').then(ced=>{
            this.ref = this.db.object('EmpleadosActivos');
            this.ref.snapshotChanges().subscribe(data=>{
              let activos = data.payload.val();
              for(let i in activos)
              {
                activos[i].key = i;
                if(ced.value == activos[i].key)
                {
                  this.datos.setClave(activos[i].CodigoActivacion);
                  this.datos.setCedula(ced.value);
                  this.encontrado = 1;
                  this.router.navigate(['dashboard']);
                }else if(this.empleado.codigo != activos[i].key && this.encontrado == 0){
                  this.servicio.mensaje('customToast', 'No estás registrado en ningún sistema');
                }
              }
            })
          })
        }
      })
  }

  async guardarUsuario(llave: any, valor: any)
  {
    await Storage.set({key: llave, value: valor});
  }
  async getUsuario(llave: any):Promise <{value: any}>
  {
    return (await Storage.get({key: llave}));
  }

  // async clearUsuario()
  // {
  //   return (await Storage.clear());
  // }

  cambiarRol(val:any)
  {
    switch(val.detail.value)
    {
      case "Jefe":
        this.seleccionado = 1;
      break;
      case "Empleado":
        this.seleccionado = 2;
      break;
    }
  }

  Volver()
  {
    this.seleccionado = 0;
  }

  iniciarSesion()
  {
    this.auth.signInWithEmailAndPassword(this.jefe.correo, this.jefe.password)
    .then(()=>{
      this.auth.currentUser.then(usr=>{
        this.datos.setClave(usr.uid);
        if(this.jefe.sesionIniciada)
        {
          this.guardarUsuario('usuario', this.jefe.correo);
          this.guardarUsuario('password', this.jefe.password);
        }
        this.guardarUsuario('posicion','jefe');
        this.router.navigate(['dashboardjefe']);
      }); 
    }).catch((err)=>{
        switch(err.code)
        {
          case "auth/invalid-email":
            this.servicio.mensaje('customToast',"Email inválido")
            break;
          case "auth/wrong-password":
            this.servicio.mensaje('customToast',"Contraseña incorrecta");
            break;
          case "auth/user-not-found":
            this.servicio.mensaje('customToast',"El usuario no existe");
            break;
        }
    })
  }

  iniciarEmpleado()
  {
    this.ref = this.db.object('EmpleadosActivos');
    this.ref.snapshotChanges().subscribe(data=>{
      let activos = data.payload.val();
      for(let i in activos)
      {
        activos[i].key = i;
        if(this.empleado.codigo == activos[i].key)
        {
          if(this.empleado.sesionIniciada){
            this.guardarUsuario('posicion', 'empleado')
            this.guardarUsuario('cedula', this.empleado.codigo);
          }
          this.datos.setCedula(this.empleado.codigo);
          this.datos.setClave(activos[i].CodigoActivacion);
          this.router.navigate(['dashboard']);
          this.encontrado = 1;
        }else if(this.empleado.codigo != activos[i].key && this.encontrado == 0){
          this.servicio.mensaje('customToast', 'No estás registrado en ningún sistema');
        }
      }
    })
  }

}
