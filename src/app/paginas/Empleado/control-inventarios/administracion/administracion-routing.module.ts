import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministracionPage } from './administracion.page';

const routes: Routes = [
  {
    path: '',
    component: AdministracionPage
  },
  {
    path: 'detalles-producto',
    loadChildren: () => import('../../../Empleado/control-inventarios/administracion/detalles-producto/detalles-producto.module').then( m => m.DetallesProductoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionPageRoutingModule {}
