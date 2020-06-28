import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracionPageRoutingModule } from './administracion-routing.module';

import { AdministracionPage } from './administracion.page';
import { EntradaComponent } from './entrada/entrada.component';
import { SalidaComponent } from './salida/salida.component';
import { AlertPersonalizadoComponent } from 'src/app/core/alert-personalizado/alert-personalizado.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdministracionPageRoutingModule
  ],
  declarations: [AdministracionPage, EntradaComponent, SalidaComponent, AlertPersonalizadoComponent]
})
export class AdministracionPageModule {}
