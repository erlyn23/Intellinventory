import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesProductoPageRoutingModule } from './detalles-producto-routing.module';

import { DetallesProductoPage } from './detalles-producto.page';
import { EntradaComponent } from './entrada/entrada.component';
import { SalidaComponent } from './salida/salida.component';
import { InventarioActualComponent } from './inventario-actual/inventario-actual.component';
import { NotasComponent } from './notas/notas.component';
import { NotasEntradaComponent } from './notas-entrada/notas-entrada.component';
import { NotasSalidaComponent } from './notas-salida/notas-salida.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetallesProductoPageRoutingModule
  ],
  declarations: [DetallesProductoPage, 
    EntradaComponent, 
    NotasEntradaComponent,
    NotasSalidaComponent,
    SalidaComponent, 
    InventarioActualComponent, 
    NotasComponent]
})
export class DetallesProductoPageModule {}
