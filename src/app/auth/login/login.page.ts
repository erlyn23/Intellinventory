import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Plugins } from '@capacitor/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { Employee } from 'src/app/shared/models/Employee';
import { Boss } from 'src/app/shared/models/Boss';

const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  position: string;
  roleSelected: number = 0;
  searchEmployeeRef: AngularFireObject<Employee>;
  boss: Boss;
  employee: Employee;
  found: number = 0;

  constructor(private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private generalSvc: GeneralService,
    private dataSvc: DatosService,
    private angularFireAuth:AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router) { 
    }

  ngOnInit() {
    this.startAutomaticSession();
  }

  startAutomaticSession()
  {
    this.found = 0;
      this.getSavedDataInLocalStorage('role').then(role=>{
        if(role.value == 'boss')
        {
          this.getSavedDataInLocalStorage('bossEmail').then(user=>{
            this.getSavedDataInLocalStorage('bossPassword').then(password=>{
              if(user.value != null && password.value != null){
                this.generalSvc.presentLoading('Iniciando sesión, por favor espera...');
                this.angularFireAuth.signInWithEmailAndPassword(user.value, password.value).then(()=>{
                  this.angularFireAuth.currentUser.then(loggedUser=>{
                    this.saveDataInLocalStorage('barKey',loggedUser.uid);
                    this.dataSvc.setBarKey(loggedUser.uid);
                    this.loadingCtrl.dismiss();
                    this.router.navigate(['dashboardjefe']);
                  });
                });
              }
            })
          }).catch((err)=>{
            this.loadingCtrl.dismiss();
            this.generalSvc.presentToast('customToast',err);
          })
        }
        else
        {
          this.getSavedDataInLocalStorage('employeeCode').then(employeeCode=>{
            if(employeeCode.value != null){
              this.generalSvc.presentLoading('Iniciando sesión, por favor espera...');
              this.searchEmployeeRef = this.angularFireDatabase.object('EmpleadosActivos/'+employeeCode.value);
              this.searchEmployeeRef.valueChanges().subscribe(employee=>{
              if(employee != null)
              {
                  this.dataSvc.setBarKey(employee.ActivationCode);
                  this.dataSvc.setEmployeeCode(employee.Code);
                  this.found = 1;
                  this.loadingCtrl.dismiss();
                  this.router.navigate(['dashboard']).then(()=>{
                    this.found = 0;
                  });
              }else{
                this.loadingCtrl.dismiss();
                this.generalSvc.presentToast('customToast', 'No estás registrado en ningún sistema');
              }
            })
            }
          })
        }
      })
  }

  async getSavedDataInLocalStorage(key: string):Promise <{value: string}>
  {
    return (await Storage.get({key: key}));
  }

  async saveDataInLocalStorage(key: string, valor: any)
  {
    await Storage.set({key: key, value: valor});
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false,'first');
    this.menuCtrl.enable(false, 'second');
  }

  changeRole(roleValue:any)
  {
    switch(roleValue.detail.value)
    {
      case "Jefe":
        this.roleSelected = 1;
      break;
      case "Empleado":
        this.roleSelected = 2;
      break;
    }
  }

  goToSelectRoleScreen()
  {
    this.roleSelected = 0;
  }

  startBossSessionWithEnterButton(event)
  {
    if(event == 13){
      this.startBossSession();
    }
  }

  startBossSession()
  {
    this.generalSvc.presentLoading('Iniciando sesión, por favor espera...');
    this.angularFireAuth.signInWithEmailAndPassword(this.boss.Email, this.boss.Password)
    .then(()=>{
      this.angularFireAuth.currentUser.then(user=>{
        this.dataSvc.setBarKey(user.uid);
        if(this.boss.StartedSession)
        {
          this.saveDataInLocalStorage('bossEmail', this.boss.Email);
          this.saveDataInLocalStorage('bossPassword', this.boss.Password);
        }
        this.saveDataInLocalStorage('role','boss');
        this.saveDataInLocalStorage('barKey',user.uid);
        this.loadingCtrl.dismiss();
        this.router.navigate(['dashboardjefe']).then(()=>{
          this.boss.Email = "";
          this.boss.Password = "";
        });
      }); 
    }).catch((err)=>{
        switch(err.code)
        {
          case "auth/invalid-email":
            this.loadingCtrl.dismiss();
            this.generalSvc.presentToast('customToast',"Correo o contraseña incorrecta")
            break;
          case "auth/wrong-password":
            this.loadingCtrl.dismiss();
            this.generalSvc.presentToast('customToast',"Correo o contraseña incorrecta");
            break;
          case "auth/user-not-found":
            this.loadingCtrl.dismiss(); 
            this.generalSvc.presentToast('customToast',"El usuario no existe");
            break;
        }
    })
  }

  startEmployeeSessionWithEnterButton(event){
    if(event == 13){
      this.startEmployeeSession();
    }
  }

  
  startEmployeeSession()
  {
    this.searchEmployeeRef = this.angularFireDatabase.object('EmpleadosActivos/'+this.employee.Code);
    this.searchEmployeeRef.valueChanges().subscribe(employeData=>{
      if(employeData != null)
      {
        if(this.employee.StartedSession){
          this.saveDataInLocalStorage('employeeCode', this.employee.Code);
        }
        this.saveDataInLocalStorage('role','employee');
        this.dataSvc.setEmployeeCode(this.employee.Code);
        this.dataSvc.setBarKey(employeData.ActivationCode);
        this.router.navigate(['dashboard']).then(()=>{
          this.employee.Code = "";
        })
      }else{
        this.generalSvc.presentToast('customToast', 'No estás registrado en ningún sistema');
      }
    });
  }

}
