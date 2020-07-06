import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracionPageRoutingModule } from './administracion-routing.module';

import { AdministracionPage } from './administracion.page';
import { AlertPersonalizadoComponent } from 'src/app/core/alert-personalizado/alert-personalizado.component';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdministracionPageRoutingModule
  ],
  declarations: [AdministracionPage, AlertPersonalizadoComponent, CrearProductoComponent]
})
export class AdministracionPageModule {}
