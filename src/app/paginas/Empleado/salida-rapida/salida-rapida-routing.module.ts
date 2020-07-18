import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalidaRapidaPage } from './salida-rapida.page';

const routes: Routes = [
  {
    path: '',
    component: SalidaRapidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalidaRapidaPageRoutingModule {}
