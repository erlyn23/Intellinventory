import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { DatosService } from 'src/app/services/datos.service';
import { Employee } from 'src/app/shared/models/Employee';
import { Boss } from 'src/app/shared/models/Boss';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  position: string = "";
  roleSelected: number = 0;
  searchEmployeeRef: AngularFireObject<Employee>;
  employeeSubscription: Subscription;
  boss: Boss = { Email :'', 
  Password: '', 
  Photo: '', 
  PhoneNumber: '', 
  Name: '', 
  CompanyName: '', 
  StartedSession: false
  };

  employee: Employee = { Code: '', 
  Name: '', 
  Age: '', 
  PhoneNumber: '', 
  Photo: '', 
  Email: '', 
  StartedSession: false, 
  ActivationCode: '' };
  found: number = 0;

  constructor(private menuCtrl: MenuController,
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
      this.generalSvc.getLocalStorageData('role').then(role=>{
        if(role.value == 'boss')
        {
          this.generalSvc.getLocalStorageData('bossEmail').then(user=>{
            this.generalSvc.getLocalStorageData('bossPassword').then(password=>{
              if(user.value != null && password.value != null){
                this.generalSvc.presentLoading('Iniciando sesión, por favor espera...');
                this.angularFireAuth.signInWithEmailAndPassword(user.value, password.value).then(()=>{
                  this.angularFireAuth.currentUser.then(loggedUser=>{
                    this.generalSvc.saveDataInLocalStorage('barKey',loggedUser.uid);
                    this.dataSvc.setBarKey(loggedUser.uid);
                    this.generalSvc.closeLoading();
                    this.router.navigate(['dashboardjefe']);
                  });
                });
              }
            })
          }).catch((err)=>{
            this.generalSvc.closeLoading();
            this.generalSvc.presentToast('customToast',err);
          })
        }
        else
        {
          this.generalSvc.getLocalStorageData('employeeCode').then(async employeeCode=>{
            const employeePassword = await this.generalSvc.getLocalStorageData('employeePassword');
            if(employeeCode.value != null){
              this.searchEmployeeRef = this.angularFireDatabase.object('EmpleadosActivos/'+employeeCode.value);
              this.employeeSubscription = this.searchEmployeeRef.valueChanges().subscribe(employee=>{
              if(employee != null)
              {
                if(employee.Password === employeePassword.value){
                  this.dataSvc.setBarKey(employee.ActivationCode);
                  this.dataSvc.setEmployeeCode(employeeCode.value);
                  this.found = 1;
                  this.router.navigate(['dashboard']).then(()=>{
                    this.found = 0;
                  });
                }else{
                  this.generalSvc.presentToast('customToast', 'Código o contraseña incorrecta');
                }
              }else{
                this.generalSvc.presentToast('customToast', 'No estás registrado en el sistema, contacta con tu empleador');
              }
            })
            }
          })
        }
      })
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
        this.position = "Jefe";
        this.roleSelected = 1;
      break;
      case "Empleado":
        this.position = "Empleado";
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
          this.generalSvc.saveDataInLocalStorage('bossEmail', this.boss.Email);
          this.generalSvc.saveDataInLocalStorage('bossPassword', this.boss.Password);
        }
        this.generalSvc.saveDataInLocalStorage('role','boss');
        this.generalSvc.saveDataInLocalStorage('barKey',user.uid);
        this.generalSvc.closeLoading();
        this.router.navigate(['dashboardjefe']).then(()=>{
          this.boss.Email = "";
          this.boss.Password = "";
        });
      }); 
    }).catch((err)=>{
        switch(err.code)
        {
          case "auth/invalid-email":
            this.generalSvc.closeLoading();
            this.generalSvc.presentToast('customToast',"Correo o contraseña incorrecta")
            break;
          case "auth/wrong-password":
            this.generalSvc.closeLoading();
            this.generalSvc.presentToast('customToast',"Correo o contraseña incorrecta");
            break;
          case "auth/user-not-found":
            this.generalSvc.closeLoading();
            this.generalSvc.presentToast('customToast',"El usuario no existe");
            break;
        }
    })
  }

  startEmployeeSessionWithEnterButton(event){
    //El número 13 representa cuando le dan a Enter
    if(event == 13){
      this.startEmployeeSession();
    }
  }

  
  startEmployeeSession()
  {
    const employeeAuthRoute = `EmpleadosActivos/${this.employee.Code}`;
    this.searchEmployeeRef = this.angularFireDatabase.object(employeeAuthRoute);
    this.employeeSubscription = this.searchEmployeeRef.valueChanges().subscribe(employeeData=>{
      if(employeeData != null)
      {
        if(employeeData.Password === this.employee.Password){
          if(this.employee.StartedSession){
            this.generalSvc.saveDataInLocalStorage('employeeCode', this.employee.Code);
            this.generalSvc.saveDataInLocalStorage('employeePassword', this.employee.Password);
          }
          this.generalSvc.saveDataInLocalStorage('role','employee');
          this.dataSvc.setEmployeeCode(this.employee.Code);
          this.dataSvc.setBarKey(employeeData.ActivationCode);
          this.router.navigate(['dashboard']).then(()=>{
            this.employee.Code = "";
            this.employee.Password = "";
          });
        }else{
          this.generalSvc.presentToast('customToast', 'Código o contraseña incorrecta');
        }
      }else{
        this.generalSvc.presentToast('customToast', 'No estás registrado en ningún sistema');
      }
    });
  }

  ngOnDestroy(): void{
    this.employeeSubscription?.unsubscribe();
  }
}
