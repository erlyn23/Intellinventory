import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPerfilJefePageRoutingModule } from './editar-perfil-jefe-routing.module';

import { EditarPerfilJefePage } from './editar-perfil-jefe.page';
import { CabeceraJefeComponent } from 'src/app/core/cabecera-jefe/cabecera-jefe.component';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarPerfilJefePageRoutingModule
  ],
  declarations: [EditarPerfilJefePage, CabeceraJefeComponent, CambiarPasswordComponent]
})
export class EditarPerfilJefePageModule {}
