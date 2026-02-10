import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotificationService } from 'src/app/components/notification/notification.service';

@Component({
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit, AfterViewInit {

  barbers = [
    {
      name: 'Rafael Santos',
      role: 'Master Barber',
      image: 'https://thumbs.dreamstime.com/b/retrato-do-barbeiro-%C3%A0-moda-com-barba-e-de-ferramentas-profissionais-em-um-fundo-escuro-69023290.jpg'
    },
    {
      name: 'Bruno Machado',
      role: 'Barber',
      image: 'https://i.pinimg.com/originals/3c/eb/f7/3cebf70e745460741acf65936e7d1ad0.jpg'
    },
    {
      name: 'Henrique Luis',
      role: 'Barber',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9DIEi41Vmvh8Pb-YjRuW-KcdQMX28uFLblg&s'
    }
  ];
  services = [
    {
      name: 'Social',
      price: 'R$ 40,00',
      duration: '30 min',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQklciRE8HI-Jr8zsfVzAEJlTsW6PVJlcq4HA&s',
    },
    {
      name: 'Degradê',
      price: 'R$ 50,00',
      duration: '40 min',
      image: 'https://static.wixstatic.com/media/ada5da_bdd6d0f695bd47a38c0572a95de578b4~mv2.jpg',
    },
    {
      name: 'Cabelo e Barba',
      price: 'R$ 60,00',
      duration: '45 min',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeOn3CjjaUe5aIQ3cqNMN4yIKyAcsoTpbiZA&s',
    },
    {
      name: 'Barba',
      price: 'R$ 20,00',
      duration: '20 min',
      image: 'https://i.pinimg.com/originals/3d/56/bc/3d56bc8569f1f55c69d7a05b96963334.jpg',
    },
    {
      name: 'Infantil',
      price: 'R$ 25,00',
      duration: '30 min',
      image: 'https://dicasdecabelo.com.br/wp-content/uploads/2024/07/corte-de-cabelo-masculino-infantil01.jpg',
    },
  ];

  availableTimes = [
    '07:00',
    '08:20',
    '10:00',
    '11:40',
    '14:00',
    '15:20',
    '17:00',
    '18:20',
    '19:00',
  ];

  selectedBarber: number | null = null;
  selectedService: number | null = null;
  selectedDate: Date | null = null;
  selectedDateLabel: string | null = null;
  selectedTime: number | null = null;

  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {}

  confirmarAgendamento(): void {
    if (this.selectedBarber !== null && this.selectedService !== null && this.selectedDate && this.selectedTime !== null) {
      const barber = this.barbers[this.selectedBarber].name;
      const service = this.services[this.selectedService].name;
      const time = this.availableTimes[this.selectedTime];
      const date = this.selectedDate.toLocaleDateString('pt-BR');

      this.notificationService.showNotification(
        `Agendamento confirmado com sucesso.`,
        'success'
      );
    } else {
      this.notificationService.showNotification('Por favor, preencha todos os campos!', 'alert');
    }
  }

  selectBarber(index: number): void {
    this.selectedBarber = index;
  }

  selectService(index: number): void {
    this.selectedService = index;
  }

  onDateChange(event: Date): void {
    this.selectedDate = event; 
    this.selectedDateLabel = this.formatDate(event);
    console.log('Data selecionada:', event); 
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