import { Routes } from '@angular/router';
import {ClienteListarComponent} from "./components/cliente/cliente-listar/cliente-listar.component";
import {ClienteFormComponent} from "./components/cliente/cliente-form/cliente-form.component";

const clienteRoutes: Routes = [
  {path: 'cliente', component: ClienteListarComponent},
  {path: 'cliente/incluir', component: ClienteFormComponent},
  {path: 'cliente/:id/alterar', component: ClienteFormComponent
  }
];

export const routes: Routes = [
  ...clienteRoutes,
];
