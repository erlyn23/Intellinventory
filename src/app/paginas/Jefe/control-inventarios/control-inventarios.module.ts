import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlInventariosPageRoutingModule } from './control-inventarios-routing.module';

import { ControlInventariosPage } from './control-inventarios.page';
import { CabeceraJefeComponent } from 'src/app/core/cabecera-jefe/cabecera-jefe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlInventariosPageRoutingModule
  ],
  declarations: [ControlInventariosPage,CabeceraJefeComponent]
})
export class ControlInventariosPageModule {}
