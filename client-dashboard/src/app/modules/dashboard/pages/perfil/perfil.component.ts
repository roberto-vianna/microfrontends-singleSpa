import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { Usuario } from 'src/app/models/agendamento.model';

@Component({
  templateUrl: './perfil.component.html'
})

export class PerfilComponent implements OnInit {
    user: Usuario = {
    fullName: '',
    email: '',
    telefone: '',
    password: '',
    type: 'cliente',
  };
  originalEmail: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor( private notificationService: NotificationService ) {}

  ngOnInit(): void {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}'); 

    if (loggedUser  && loggedUser.email) {
      this.user = { ...loggedUser };
      this.originalEmail = loggedUser.email;
    }
  }
  updateProfile(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]'); 
    const userIndex = users.findIndex((u: any) => u.email === this.originalEmail);

    if (userIndex !== -1) {
       let hasChanges = false;
       if (this.newPassword || this.confirmNewPassword) {
        if (this.newPassword !== this.confirmNewPassword) {
          this.notificationService.showNotification(
            `A nova senha e a confirmação não correspondem.`,
            'alert'
          );
          return;
        }
        users[userIndex].password = this.newPassword;
        this.user.password = this.newPassword;
        this.newPassword = '';
        this.confirmNewPassword = '';
        hasChanges = true;
      }
      if (
        this.user.fullName !== users[userIndex].fullName ||
        this.user.email !== users[userIndex].email ||
        this.user.telefone !== users[userIndex].telefone
      ) {
        hasChanges = true; 
      }

      if (hasChanges) {
        users[userIndex] = { ...this.user, password: users[userIndex].password };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedUser', JSON.stringify(this.user));

        this.notificationService.showNotification(
          `Perfil atualizado com sucesso!`,
          'success'
        );
      } else {
        this.notificationService.showNotification(
          `Nenhuma alteração encontrada.`,
          'alert'
        );
      }
    } else {
      this.notificationService.showNotification(
        `Erro ao atualizar perfil. Contate suporte técnico!`,
        'error'
      );
    }
  }
  resetForm(): void {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    if (loggedUser && loggedUser.email) {
      this.user = { ...loggedUser };
      this.newPassword = '';
      this.confirmNewPassword = '';
    } else {
      this.notificationService.showNotification(
        `Erro: Não foi possível restaurar os dados.`,
        'error'
      );
    }
  }
}
