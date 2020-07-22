import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import {AuthGuard} from "./guards/auth.guard";
import {NuevoCursoComponent} from "./pages/nuevo-curso/nuevo-curso.component";

const routes: Routes = [
  { path: 'home/:id'    , component: HomeComponent, canActivate: [ AuthGuard ] },
  { path: 'registro', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  { path: 'curso/:iduser/:idcourse'   , component: NuevoCursoComponent,canActivate:[AuthGuard] },
  { path: '**',pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{useHash:true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
