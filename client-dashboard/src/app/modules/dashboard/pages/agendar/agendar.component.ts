import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { availableTimes, barbers, services } from './data/data.agendar';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit, AfterViewInit {
  barbers = barbers
  services = services
  originalAvailableTimes: { time: string; isDisabled: boolean }[] = [...availableTimes];
  availableTimes: { time: string; isDisabled: boolean }[] = [];

  selectedBarber: number | null = null;
  selectedService: number | null = null;
  selectedDate: Date | null = null;
  selectedDateLabel: string | null = null;
  selectedTime: number | null = null;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
  const today = new Date();
  this.selectedDate = today;
  this.selectedDateLabel = this.formatDate(today);
  this.filterAvailableTimes();
  }
  
  confirmarAgendamento(): void {
    if (this.selectedBarber !== null && 
      this.selectedService !== null && 
      this.selectedDate && 
      this.selectedTime !== null
    ) {
      const newAppointment = {
        barber: this.barbers[this.selectedBarber].name,
        service: this.services[this.selectedService].name,
        date: this.selectedDate.toLocaleDateString('pt-BR'),
        time: this.availableTimes[this.selectedTime],
        price: this.services[this.selectedService].price,
        status: 'ativo'
      };
      const existingAppointments = this.localStorageService.getItem('agendamentos') || [];
      existingAppointments.push(newAppointment);
      this.localStorageService.setItem('agendamentos', existingAppointments);
      this.notificationService.showNotification(
        `Agendamento confirmado com sucesso.`,
        'success'
      );
      this.router.navigate(['/dashboard/meus-agendamentos']);
    } else {
      this.notificationService.showNotification('Por favor, preencha todos os campos!', 'alert');
    }
  }

  selectBarber(index: number): void {
    this.selectedBarber = index;
    this.filterAvailableTimes();
  }

  selectService(index: number): void {
    this.selectedService = index;
  }

  onDateChange(event: Date): void {
    this.selectedDate = event; 
    this.selectedDateLabel = this.formatDate(event);
    this.filterAvailableTimes(); 
  }

  selectTime(index: number): void {
    this.selectedTime = index;
  }

  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  }

  private filterAvailableTimes(): void {
    if (this.selectedBarber === null) {
      this.availableTimes = [];
      return;
    }
    
    const existingAppointments = this.localStorageService.getItem('agendamentos') || [];
     const agora = new Date(); 

    this.availableTimes = this.originalAvailableTimes.map((slot) => {
      const isPastTime = (() => {
        if (this.selectedDate! < new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())) {
          return true;
        }
        if (this.selectedDate?.toDateString() === agora.toDateString()) {
          const [hora, minuto] = slot.time.split(':').map(Number); 
          const agoraHora = agora.getHours();
          const agoraMinuto = agora.getMinutes();
          return hora < agoraHora || (hora === agoraHora && minuto <= agoraMinuto); 
        }
        return false;
      })();
      const isDisabled = existingAppointments.some((appointment: any) => {
        const appointmentTime = typeof appointment.time === 'object' ? appointment.time.time : appointment.time;
        return (
          appointment.date === this.selectedDate?.toLocaleDateString('pt-BR') &&
          appointmentTime === slot.time &&
          appointment.barber === this.barbers[this.selectedBarber!].name &&
          appointment.status === 'ativo'
        );
      });
      return { ...slot,isDisabled: isPastTime || isDisabled };
    });
  }

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