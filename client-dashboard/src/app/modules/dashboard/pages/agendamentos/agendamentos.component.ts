import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { Router } from '@angular/router';
import { Agendamento } from 'src/app/models/agendamento.model';

@Component({
  templateUrl: './agendamentos.component.html',
})
export class AgendamentosComponent implements OnInit {
  agendamentoAberto: Agendamento[] = [];
  historico: Agendamento[] = [];
  mostrarTudo: boolean = false;

  constructor( 
    private router: Router, 
    private localStorageService: LocalStorageService , 
    private notificationService: NotificationService, 
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
    this.carregarBarbeirosLookup();
  }

  alternarHistorico(): void {
    this.mostrarTudo = !this.mostrarTudo; 
  }
  novoAgendamento(): void {
    this.router.navigate(['/dashboard/agendar']);
  }
  
  alterarAgendamento(agendamento: Agendamento): void {
    localStorage.setItem('editingAgendamento', JSON.stringify(agendamento));
    this.router.navigate(['/dashboard/agendar']);
  }
  
  cancelarAgendamento(agendamento: Agendamento): void {
    const todosAgendamentos = this.localStorageService.getItem('agendamentos') || [];
    const agendamentoIndex = todosAgendamentos.findIndex((item: Agendamento) => 
      item.data === agendamento.data &&
      item.horario === agendamento.horario &&
      item.barbeiro === agendamento.barbeiro &&
      item.statusAgendamento === 'ativo'
    );

    if (agendamentoIndex !== -1) {
      todosAgendamentos[agendamentoIndex].statusAgendamento = 'cancelado';
      this.localStorageService.setItem('agendamentos', todosAgendamentos);
      this.carregarAgendamentos();
    }
          
    this.notificationService.showNotification(    
      `Agendamento cancelado com sucesso.`,
      'success'
    );
  }

  getBarberImage(a: Agendamento): string {
    if (a?.barbeiroImagem) return a.barbeiroImagem;
    const id = Number((a as any)?.idBarbeiro);
    const found = id ? this.barberLookup.get(id) : null;

    return found?.image || this.barberImageFallback;
  }

  getBarberRoleLabel(a: Agendamento): string {
    const id = Number((a as any)?.idBarbeiro);
    const found = id ? this.barberLookup.get(id) : null;
    return found?.roleLabel || 'PROFISSIONAL';
  }

  private barberLookup = new Map<number, { image: string; roleLabel: string }>();

  private readonly barberImageFallback =
    'https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg';

  private carregarBarbeirosLookup(): void {
    const users: any[] = this.localStorageService.getItem('users') || [];

    this.barberLookup.clear();

    (Array.isArray(users) ? users : [])
      .filter(u => u && u.type === 'barbeiro' && u.id)
      .forEach(u => {
        const id = Number(u.id);
        if (!id) return;

        const image =
          String(u.avatarUrl || u.barbeiroImagem || this.barberImageFallback);
        const roleLabel = u.role === 'master' ? 'MASTER' : 'PROFISSIONAL';
        this.barberLookup.set(id, { image, roleLabel });
      });
  }

  private parseDateTimeBR(data?: string, horario?: string): Date | null {
    if (typeof data !== 'string' || typeof horario !== 'string') return null;
    const [dia, mes, ano] = data.split('/').map(Number);
    const [hora, minuto] = horario.split(':').map(Number);
    return new Date(ano, mes - 1, dia, hora, minuto, 0, 0);
  }
  private getTimeOrNull(a: Agendamento): number | null {
    const dt = this.parseDateTimeBR(a.data, a.horario);
    return dt ? dt.getTime() : null;
  }
  private carregarAgendamentos(): void {
    const todosAgendamentos: Agendamento[] = this.localStorageService.getItem('agendamentos') || [];
    const agora = new Date();
    const agoraTime = agora.getTime();

    this.agendamentoAberto = todosAgendamentos.filter( a => {
     const dataHora = this.parseDateTimeBR(a.data , a.horario);
     if (!dataHora) return false;
     return a.statusAgendamento === 'ativo' && dataHora > agora
    });

    this.historico = todosAgendamentos.filter(a => {
      const dataHora = this.parseDateTimeBR(a.data, a.horario);
      if (!dataHora) return false;
      return a.statusAgendamento === 'finalizado' || a.statusAgendamento === 'cancelado' || dataHora <= agora
    });

    this.historico = [...this.historico].sort((a, b) => {
    const ta = this.getTimeOrNull(a);
    const tb = this.getTimeOrNull(b);

    if (ta === null && tb === null) return 0;
    if (ta === null) return 1;
    if (tb === null) return -1;

    const aEhFuturo = ta > agoraTime;
    const bEhFuturo = tb > agoraTime;

    if (aEhFuturo !== bEhFuturo) return aEhFuturo ? 1 : -1;
    
    return tb - ta;
  });
  }
}