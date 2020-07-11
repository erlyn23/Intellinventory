import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearStockPageRoutingModule } from './crear-stock-routing.module';

import { CrearStockPage } from './crear-stock.page';
import { CabeceraComponent } from 'src/app/core/cabecera/cabecera.component';
import { StockModalComponent } from './stock-modal/stock-modal.component';
import { DetallesStockComponent } from './detalles-stock/detalles-stock.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrearStockPageRoutingModule
  ],
  declarations: [CrearStockPage, CabeceraComponent, StockModalComponent, DetallesStockComponent]
})
export class CrearStockPageModule {}
