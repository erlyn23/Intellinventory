import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalidaRapidaPageRoutingModule } from './salida-rapida-routing.module';

import { SalidaRapidaPage } from './salida-rapida.page';
import { CabeceraComponent } from 'src/app/core/cabecera/cabecera.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SalidaRapidaPageRoutingModule
  ],
  declarations: [SalidaRapidaPage, CabeceraComponent]
})
export class SalidaRapidaPageModule {}
