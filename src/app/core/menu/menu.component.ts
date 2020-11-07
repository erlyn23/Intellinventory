import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() menuType: string;
  constructor(private menuCtrl: MenuController,
    private generalSvc: GeneralService,
    private router: Router) { }

  ngOnInit() {
  }

  closeSession()
  {
      this.generalSvc.presentAlertWithActions('Confirmar', '¿Estás seguro de querer salir?', 
      ()=>{
        this.generalSvc.clearLocalStorageData();
        this.router.navigate(['login']).then(()=>{ this.menuCtrl.toggle(); });
      }, 
      ()=>{ this.generalSvc.closeAlert();});
  }

  goToPage(page: string)
  {
    this.router.navigate([page])
    .then(()=>{
      this.menuCtrl.toggle();
    }).catch(err=>{
      this.generalSvc.presentToast('customToast', err);
    })
  }
}
