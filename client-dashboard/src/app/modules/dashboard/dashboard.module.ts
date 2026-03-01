import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AgendarComponent } from './pages/agendar/agendar.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';
import { PerfilComponent } from './pages/perfil/perfil.component'
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
@NgModule({
  declarations: [DashboardComponent, SidebarComponent, AgendarComponent, AgendamentosComponent, PerfilComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule ,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule      

  ], 
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [MatDatepickerModule , { provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class DashboardModule {}