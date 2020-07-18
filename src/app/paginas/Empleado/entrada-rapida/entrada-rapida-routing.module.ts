import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntradaRapidaPage } from './entrada-rapida.page';

const routes: Routes = [
  {
    path: '',
    component: EntradaRapidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntradaRapidaPageRoutingModule {}
