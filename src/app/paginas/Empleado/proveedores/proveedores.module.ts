import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProveedoresPageRoutingModule } from './proveedores-routing.module';

import { ProveedoresPage } from './proveedores.page';
import { CrearProveedorComponent } from './crear-proveedor/crear-proveedor.component';
import { DetallesProveedorComponent } from './detalles-proveedor/detalles-proveedor.component';
import { CabeceraComponent } from 'src/app/core/cabecera/cabecera.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProveedoresPageRoutingModule
  ],
  declarations: [ProveedoresPage, CrearProveedorComponent, DetallesProveedorComponent, CabeceraComponent]
})
export class ProveedoresPageModule {}
