import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearStockPage } from './crear-stock.page';

const routes: Routes = [
  {
    path: '',
    component: CrearStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearStockPageRoutingModule {}
