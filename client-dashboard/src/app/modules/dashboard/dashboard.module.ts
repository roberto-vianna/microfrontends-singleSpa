import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AgendarComponent } from './pages/agendar/agendar.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';
import { PerfilComponent } from './pages/perfil/perfil.component'
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DashboardComponent, SidebarComponent, AgendarComponent, AgendamentosComponent, PerfilComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule 
  ]
})
export class DashboardModule {}