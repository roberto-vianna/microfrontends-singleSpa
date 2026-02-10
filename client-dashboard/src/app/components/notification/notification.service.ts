import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<any>();

  getNotification() {
    return this.notificationSubject.asObservable();
  }

  showNotification(message: string, type: 'success' | 'alert' | 'error', duration = 3000) {
    this.notificationSubject.next({ message, type, duration });
  }
}