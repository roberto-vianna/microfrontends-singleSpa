import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { barbers } from '../agendar/data/data.agendar';
import { NotificationService } from 'src/app/components/notification/notification.service';

@Component({
  templateUrl: './agendamentos.component.html',
})
export class AgendamentosComponent implements OnInit {
  upcomingAppointments: any[] = [];
  historico: any[] = [];

  constructor( 
    private router: Router, 
    private localStorageService: LocalStorageService , 
    private notificationService: NotificationService, 
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  novoAgendamento(): void {
    this.router.navigate(['/dashboard/agendar']);
  }
  alterarAgendamento(agendamento: any): void {
    const todosAgendamentos = this.localStorageService.getItem('agendamentos') || [];
    const index = todosAgendamentos.findIndex((item: any) =>
      item.date === agendamento.date &&
      item.time.time === agendamento.time.time &&
      item.barber === agendamento.barber &&
      item.service === agendamento.service
    );
    if (index !== -1) {
      todosAgendamentos[index].time.isDisabled = false;
      todosAgendamentos.splice(index, 1);
      this.localStorageService.setItem('agendamentos', todosAgendamentos); 
    }
    this.router.navigate(['/dashboard/agendar']);
  }
  
  cancelarAgendamento(agendamento: any): void {
    const todosAgendamentos = this.localStorageService.getItem('agendamentos') || [];
    const agendamentoIndex = todosAgendamentos.findIndex((item: any) => 
      item.date === agendamento.date &&
      item.time.time === agendamento.time.time &&
      item.barber === agendamento.barber &&
      item.status === 'ativo'
    );

    if (agendamentoIndex !== -1) {
      todosAgendamentos[agendamentoIndex].status = 'cancelado';
      todosAgendamentos[agendamentoIndex].time.isDisabled = false;
      this.localStorageService.setItem('agendamentos', todosAgendamentos);
      this.carregarAgendamentos();
    }
          
    this.notificationService.showNotification(    
      `Agendamento cancelado com sucesso.`,
      'success'
    );
  }
  getBarberImage(barberName: string): string {
    const barber = barbers.find(b => b.name === barberName);
    return barber ? barber.image : 'https://via.placeholder.com/150';
  }
  private carregarAgendamentos(): void {
    const todosAgendamentos = this.localStorageService.getItem('agendamentos') || [];
    const hoje = new Date();
    const dataAtualFormatada = this.formatarData(hoje);

    this.upcomingAppointments = todosAgendamentos.filter((agendamento: any) => {
      const dataAgendamento = agendamento.date;
      const horaAgendamento = agendamento.time.time;
      if (dataAgendamento > dataAtualFormatada) {
        return agendamento.status === 'ativo';
      }
      if (dataAgendamento === dataAtualFormatada) {
        const [hora, minuto] = horaAgendamento.split(':').map(Number);
        const agoraHora = hoje.getHours();
        const agoraMinuto = hoje.getMinutes();
        if (hora > agoraHora || (hora === agoraHora && minuto > agoraMinuto)) {
          return agendamento.status === 'ativo';
        }
      }
      return false;
    });

    this.historico = todosAgendamentos.filter((agendamento: any) => {
      const dataAgendamento = agendamento.date;
      const horaAgendamento = agendamento.time.time;
      if (dataAgendamento < dataAtualFormatada) {
        return true;
      }
      if (dataAgendamento === dataAtualFormatada) {
        const [hora, minuto] = horaAgendamento.split(':').map(Number);
        const agoraHora = hoje.getHours()
        const agoraMinuto = hoje.getMinutes();
        if (hora < agoraHora || (hora === agoraHora && minuto <= agoraMinuto)) {
          return true;
        }
      }
      return agendamento.status === 'cancelado';
    });
  }

  private formatarData(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}