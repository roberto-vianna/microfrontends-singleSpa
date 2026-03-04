import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Agendamento, Usuario } from 'src/app/models/agendamento.model';
import { Barbeiro , Servico } from 'src/app/models/agendamento.model';

@Component({
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit, AfterViewInit {
  barbers: Barbeiro[] = [];
  services: Servico[] = []

  originalAvailableTimes: { time: string }[] = [];
  availableTimes: { time: string; isDisabled: boolean }[] = [];

  selectedBarber: number | null = null;
  selectedService: number | null = null;
  selectedDate: Date | null = null;
  selectedDateLabel: string | null = null;
  selectedTime: number | null = null;
  loggedUser: Usuario | null = null;

  editingAgendamentoId: number | null = null;
  editingAgendamento: Agendamento | null = null;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService
    
  ) {}
  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today;
    this.selectedDateLabel = this.formatDate(today);
    
    const loggedUserJson = localStorage.getItem('loggedUser');
    if (loggedUserJson) this.loggedUser = JSON.parse(loggedUserJson);

    this.carregarBarbeirosBase();
    this.carregarServicoBase();
    this.carregarHorariosBase();
    this.carregarEdicaoSeExistir();
    this.filtrarHorariosDisponiveis();
  }

  selectBarber(index: number): void {
    this.selectedBarber = index;
    this.selectedTime = null;
    this.filtrarHorariosDisponiveis();
  }

  selectService(index: number): void {
    this.selectedService = index;
  }

  onDateChange(event: Date): void {
    this.selectedDate = event; 
    this.selectedDateLabel = this.formatDate(event);
    this.filtrarHorariosDisponiveis(); 
  }

  selectTime(index: number): void {
    this.selectedTime = index;
  }
  
  confirmarAgendamento(): void {
    if (this.selectedBarber !== null && 
      this.selectedService !== null && 
      this.selectedDate && 
      this.selectedTime !== null
    ) {
      const barber = this.barbers[this.selectedBarber];
      const service = this.services[this.selectedService];
      const novoAgendamento: Agendamento = {
            id: Date.now(),
            barbeiro: barber.name,
            barbeiroImagem: barber.image,
            idBarbeiro: barber.id,
            emailBarbeiro: barber.email,
            servico: service.name,
            preco: service.priceNumber,
            tempoEstimado: `${service.durationMin} min`,
            cliente: this.loggedUser?.fullName || '',
            telefone: this.loggedUser?.telefone || '',
            data: this.selectedDate.toLocaleDateString('pt-BR'),
            horario: this.availableTimes[this.selectedTime].time,
            statusAgendamento: 'ativo',
      };
      const agendamentosExistentes: Agendamento[] = this.localStorageService.getItem('agendamentos') || [];
        if (this.editingAgendamentoId != null) {
          const index = agendamentosExistentes.findIndex(a => a.id === this.editingAgendamentoId);
          if (index !== -1) {
            agendamentosExistentes[index] = {
              ...agendamentosExistentes[index],
              ...novoAgendamento,
              id: this.editingAgendamentoId, 
            };

            this.localStorageService.setItem('agendamentos', agendamentosExistentes);
            localStorage.removeItem('editingAgendamento');
            this.editingAgendamentoId = null;
            this.editingAgendamento = null;

            this.notificationService.showNotification('Agendamento atualizado com sucesso.', 'success');
            this.router.navigate(['/dashboard/meus-agendamentos']);
            return;
          }
        }
        agendamentosExistentes.push(novoAgendamento);
        this.localStorageService.setItem('agendamentos', agendamentosExistentes);

        this.notificationService.showNotification(
          `Agendamento confirmado com sucesso.`,
          'success'
        );
        this.router.navigate(['/dashboard/meus-agendamentos']);
      } else {
        this.notificationService.showNotification('Por favor, preencha todos os campos!', 'alert');
      }
  }

  private carregarBarbeirosBase(): void {
    const users: any[] = this.localStorageService.getItem('users') || [];

    const list = (Array.isArray(users) ? users : [])
      .filter(u => u && u.type === 'barbeiro' && u.email)
      .filter(u => u.active !== false) // só ativos
      .map(u => ({
        id: Number(u.id),
        name: String(u.fullName || '—'),
        email: String(u.email || ''),
        image: String(u.avatar || u.barbeiroImagem || this.avatarFallback),
        role: (u.role === 'master' ? 'MASTER' : 'PROFISSIONAL') as 'MASTER' | 'PROFISSIONAL',
      }))
      .sort((a, b) => {
        if (a.role !== b.role) return a.role === 'MASTER' ? -1 : 1;
        return a.name.localeCompare(b.name, 'pt-BR');
      });

    this.barbers = list;
    if (this.selectedBarber != null && !this.barbers[this.selectedBarber]) {
      this.selectedBarber = null;
      this.selectedTime = null;
    }
  }

  private carregarServicoBase(): void {
    const servicesStorage: any[] = this.localStorageService.getItem('services') || [];

    const service = (Array.isArray(servicesStorage) ? servicesStorage : [])
        .filter(s => s && s.name)
        .filter(s => s.active !== false) 
        .map(s => {
          const priceNumber = Number(s.price ?? 0);
          const durationMin = Number(s.durationMin ?? 0);

          return {
          id: Number(s.id),
          name: String(s.name || '—'),
          price: this.formatBRL(priceNumber),
          imageUrl: String(s.imageUrl || this.avatarFallback),
          duration: `${durationMin} min`,
          priceNumber,
          durationMin,
          description: String(s.description),
          } as Servico
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

      this.services = service;
      if (this.selectedService != null && !this.services[this.selectedService]) {
      this.selectedService = null;
    }
  }

    private carregarHorariosBase(): void {
    const stored = this.localStorageService.getItem('availableTimes') || [];
    const list = (Array.isArray(stored) ? stored : [])
      .map((t: any) => ({ time: String(t?.time || '').trim() }))
      .filter(t => /^\d{2}:\d{2}$/.test(t.time))
      .sort((a, b) => a.time.localeCompare(b.time));

    this.originalAvailableTimes = list;
  }

  private filtrarHorariosDisponiveis(): void {
    if (this.selectedBarber === null || !this.selectedDate) {
      this.availableTimes = [];
      return;
    }

    const agendamentos: Agendamento[] = this.localStorageService.getItem('agendamentos') || [];
    const blockedTimes: { idBarbeiro: number; date: string; time: string }[] =
      this.localStorageService.getItem('blockedTimes') || [];

    const agora = new Date();
    const startToday = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

    const dataSelecionadaBR = this.selectedDate.toLocaleDateString('pt-BR');
    const barbeiroId = this.barbers[this.selectedBarber].id;

    const blockedSet = new Set(
      blockedTimes
        .filter(b => Number(b.idBarbeiro) === Number(barbeiroId) && b.date === dataSelecionadaBR)
        .map(b => b.time)
    );

    const bookedSet = new Set(
      agendamentos
        .filter(a =>
          a.id !== this.editingAgendamentoId &&
          Number(a.idBarbeiro) === Number(barbeiroId) &&
          a.data === dataSelecionadaBR &&
          (a.statusAgendamento === 'ativo' || a.statusAgendamento === 'em_andamento')
        )
        .map(a => a.horario)
    );

    const isPastDate = this.selectedDate < startToday;

    this.availableTimes = this.originalAvailableTimes.map((slot) => {
      const isPastTimeToday = (() => {
        if (this.selectedDate?.toDateString() !== agora.toDateString()) return false;
        const [hora, minuto] = slot.time.split(':').map(Number);
        const agoraHora = agora.getHours();
        const agoraMinuto = agora.getMinutes();
        return hora < agoraHora || (hora === agoraHora && minuto <= agoraMinuto);
      })();

      const isDisabled =
        isPastDate ||
        isPastTimeToday ||
        bookedSet.has(slot.time) ||
        blockedSet.has(slot.time);

      return { time: slot.time, isDisabled };
    });
  }

  private carregarEdicaoSeExistir(): void {
    const raw = localStorage.getItem('editingAgendamento');
    if (!raw) return;

    try {
      const ag: Agendamento = JSON.parse(raw);
      this.editingAgendamento = ag;
      this.editingAgendamentoId = ag.id;

      const dt = this.parseBRDate(ag.data);
      if (dt) {
        this.selectedDate = dt;
        this.selectedDateLabel = this.formatDate(dt);
      }

      const idxBarber = this.barbers.findIndex(b => Number(b.id) === Number((ag as any).idBarbeiro));
      this.selectedBarber = idxBarber >= 0 ? idxBarber : null;

      const idxService = this.services.findIndex(s => s.name === ag.servico);
      this.selectedService = idxService >= 0 ? idxService : null;

      this.filtrarHorariosDisponiveis();

      const idxTime = this.availableTimes.findIndex(t => t.time === ag.horario);
      this.selectedTime = idxTime >= 0 ? idxTime : null;
    } catch {
      this.editingAgendamento = null;
      this.editingAgendamentoId = null;
    }
  }

  private parseBRDate(dateBR: string): Date | null {
    if (!dateBR) return null;
    const [dd, mm, yyyy] = dateBR.split('/').map(Number);
    if ([dd, mm, yyyy].some(Number.isNaN)) return null;
    return new Date(yyyy, mm - 1, dd);
  }
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  }

  private formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  }

  private readonly avatarFallback =
    'https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg';


  ngAfterViewInit(): void {
    const carousel = document.getElementById('carousel') as HTMLElement;
    const scrollLeftButton = document.getElementById('scrollLeft') as HTMLElement;
    const scrollRightButton = document.getElementById('scrollRight') as HTMLElement;

    const scrollAmount = 200; 
    scrollLeftButton.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    scrollRightButton.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

}