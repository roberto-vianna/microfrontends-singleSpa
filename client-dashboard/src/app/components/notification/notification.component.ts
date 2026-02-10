import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'alert' | 'error' = 'success';
  @Input() duration: number = 3000;

  @Output() close = new EventEmitter<void>();

  visible = true;

  notificationClass = '';
  iconClass = '';

  ngOnInit() {
    this.notificationClass = this.getNotificationClass();
    this.iconClass = this.getIconClass();

    setTimeout(() => {
      this.closeNotification();
    }, this.duration);
  }

  getNotificationClass() {
    switch (this.type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'alert':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  getIconClass() {
    return 'bg-transparent text-white';
  }

  closeNotification() {
    this.visible = false;
    this.close.emit();
  }
}