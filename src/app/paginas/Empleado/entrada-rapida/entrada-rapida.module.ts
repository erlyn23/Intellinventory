import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntradaRapidaPageRoutingModule } from './entrada-rapida-routing.module';

import { EntradaRapidaPage } from './entrada-rapida.page';
import { CabeceraComponent } from 'src/app/core/cabecera/cabecera.component';
import { MenuComponent } from 'src/app/core/menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EntradaRapidaPageRoutingModule
  ],
  declarations: [EntradaRapidaPage, CabeceraComponent]
})
export class EntradaRapidaPageModule {}
