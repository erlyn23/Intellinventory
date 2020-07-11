import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SucursalesJefePage } from './sucursales-jefe.page';

const routes: Routes = [
  {
    path: '',
    component: SucursalesJefePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SucursalesJefePageRoutingModule {}
