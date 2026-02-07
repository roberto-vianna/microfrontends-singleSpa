import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { AgendarComponent } from './pages/agendar/agendar.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

// dashboard-routing.module.ts
const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'agendar', component: AgendarComponent },
      { path: 'meus-agendamentos', component: AgendamentosComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'agendar', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}