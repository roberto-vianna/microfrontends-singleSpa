import { Component } from '@angular/core';
import { NotificationService } from './components/notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  notification: any = { visible: false };

  constructor(private notificationService: NotificationService) {
    this.notificationService.getNotification().subscribe((payload) => {
      this.notification = { ...payload, visible: true };
      setTimeout(() => {
        this.notification.visible = false;
      }, payload.duration || 3000);
    });
  }
}