import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { CabeceraJefeComponent } from 'src/app/core/cabecera-jefe/cabecera-jefe.component';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage, CabeceraJefeComponent, ModalCrearComponent]
})
export class DashboardPageModule {}
