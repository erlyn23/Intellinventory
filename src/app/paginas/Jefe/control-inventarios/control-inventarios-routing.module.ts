import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlInventariosPage } from './control-inventarios.page';

const routes: Routes = [
  {
    path: '',
    component: ControlInventariosPage
  },
  {
    path: 'administracion',
    loadChildren: () => import('../../Jefe/control-inventarios/administracion/administracion.module').then( m => m.AdministracionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlInventariosPageRoutingModule {}
