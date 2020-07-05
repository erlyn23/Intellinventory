import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlInventariosPageRoutingModule } from './control-inventarios-routing.module';

import { ControlInventariosPage } from './control-inventarios.page';
import { CabeceraComponent } from 'src/app/core/cabecera/cabecera.component';
import { CrearInventarioComponent } from './crear-inventario/crear-inventario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ControlInventariosPageRoutingModule
  ],
  declarations: [ControlInventariosPage, CabeceraComponent, CrearInventarioComponent]
})
export class ControlInventariosPageModule {}
