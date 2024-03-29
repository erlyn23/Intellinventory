import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SucursalesPageRoutingModule } from './sucursales-routing.module';

import { SucursalesPage } from './sucursales.page';
import { CabeceraComponent } from 'src/app/core/cabecera/cabecera.component';
import { CrearSucursalComponent } from './crear-sucursal/crear-sucursal.component';
import { PedirClaveComponent } from './pedir-clave/pedir-clave.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SucursalesPageRoutingModule
  ],
  declarations: [SucursalesPage, CabeceraComponent,
  PedirClaveComponent, CrearSucursalComponent]
})
export class SucursalesPageModule {}
