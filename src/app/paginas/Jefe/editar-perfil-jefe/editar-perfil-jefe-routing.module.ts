import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPerfilJefePage } from './editar-perfil-jefe.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPerfilJefePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPerfilJefePageRoutingModule {}
