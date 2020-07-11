import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SucursalesJefePageRoutingModule } from './sucursales-jefe-routing.module';

import { SucursalesJefePage } from './sucursales-jefe.page';
import { CabeceraJefeComponent } from 'src/app/core/cabecera-jefe/cabecera-jefe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucursalesJefePageRoutingModule
  ],
  declarations: [SucursalesJefePage, CabeceraJefeComponent]
})
export class SucursalesJefePageModule {}
