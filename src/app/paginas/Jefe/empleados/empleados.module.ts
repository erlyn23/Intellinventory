import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadosPageRoutingModule } from './empleados-routing.module';

import { EmpleadosPage } from './empleados.page';
import { CabeceraJefeComponent } from 'src/app/core/cabecera-jefe/cabecera-jefe.component';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { DetallesEmpleadoComponent } from './detalles-empleado/detalles-empleado.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmpleadosPageRoutingModule
  ],
  declarations: [EmpleadosPage, CabeceraJefeComponent, ModalCrearComponent, DetallesEmpleadoComponent]
})
export class EmpleadosPageModule {}
