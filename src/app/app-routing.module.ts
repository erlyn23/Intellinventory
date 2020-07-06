import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./paginas/Empleado/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'control-inventarios',
    loadChildren: () => import('./paginas/Empleado/control-inventarios/control-inventarios.module').then( m => m.ControlInventariosPageModule)
  },
  {
    path: 'dashboardjefe',
    loadChildren: () => import('./paginas/Jefe/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'administracion',
    loadChildren: ()=> import('./paginas/Empleado/control-inventarios/administracion/administracion.module').then(m=>m.AdministracionPageModule)
  },
  {
    path: 'calculadora',
    loadChildren: () => import('./paginas/Empleado/calculadora/calculadora.module').then( m => m.CalculadoraPageModule)
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./paginas/Empleado/editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  {
    path: 'detalles-producto',
    loadChildren: () => import('./paginas/Empleado/control-inventarios/administracion/detalles-producto/detalles-producto.module').then( m => m.DetallesProductoPageModule)
  },
  {
    path: 'control-inventarios-jefe',
    loadChildren: () => import('./paginas/Jefe/control-inventarios/control-inventarios.module').then( m => m.ControlInventariosPageModule)
  },
  {
    path: 'administracion-jefe',
    loadChildren: ()=> import('./paginas/Jefe/control-inventarios/administracion/administracion.module').then(m=>m.AdministracionPageModule)
  },
  {
    path: 'detalles-producto-jefe',
    loadChildren: () => import('./paginas/Jefe/control-inventarios/administracion/detalles-producto/detalles-producto.module').then( m => m.DetallesProductoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
