import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesProductoPageRoutingModule } from './detalles-producto-routing.module';

import { DetallesProductoPage } from './detalles-producto.page';
import { NotasEntradaComponent } from 'src/app/paginas/Empleado/control-inventarios/administracion/detalles-producto/notas-entrada/notas-entrada.component';
import { NotasSalidaComponent } from 'src/app/paginas/Empleado/control-inventarios/administracion/detalles-producto/notas-salida/notas-salida.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesProductoPageRoutingModule
  ],
  declarations: [DetallesProductoPage, NotasEntradaComponent, NotasSalidaComponent]
})
export class DetallesProductoPageModule {}
