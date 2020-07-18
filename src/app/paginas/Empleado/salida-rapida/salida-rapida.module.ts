import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalidaRapidaPageRoutingModule } from './salida-rapida-routing.module';

import { SalidaRapidaPage } from './salida-rapida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalidaRapidaPageRoutingModule
  ],
  declarations: [SalidaRapidaPage]
})
export class SalidaRapidaPageModule {}
