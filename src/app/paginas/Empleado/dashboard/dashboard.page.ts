import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Employee } from 'src/app/shared/models/Employee';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  employee: Employee;
  profileEmployeePhoto: string;

  constructor(private menuCtrl: MenuController,
    private platform: Platform,
    private generalSvc: GeneralService,
    private router: Router,
    private angularFireDatabase: AngularFireDatabase,
    private angularFireStorage: AngularFireStorage) {
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.exit();
      })
    }

  ngOnInit() { 
    const employeeDbObject: AngularFireObject<Employee> = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('Empleado'));
    
    employeeDbObject.valueChanges().subscribe(employeeData=>{
      if(employeeData != null){
        this.employee = employeeData;

        const photoDirectory = this.angularFireStorage.ref(employeeData.Photo);

        photoDirectory.getDownloadURL().subscribe(employeeUrlPhoto=>{
          this.profileEmployeePhoto = employeeUrlPhoto;
        })
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  goToPage(page: string)
  {
    this.router.navigate([page]);
  }

  exit()
  {
    this.generalSvc.presentAlertWithActions('Confirmar', '¿Estás seguro de querer salir?', 
    ()=>{
      this.generalSvc.clearLocalStorageData();
      this.router.navigate(['login']);
    }, ()=>{  });
  }
}
