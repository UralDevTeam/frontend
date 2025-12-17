import {makeAutoObservable} from 'mobx';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type NotificationLink = {
  text: string;
  href: string;
}

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  link?: NotificationLink | undefined;
  duration: number;
  createdAt: number;
}


class NotificationsStore {
  notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {

    console.log(notification);

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };

    this.notifications.push(newNotification);

    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, notification.duration);
    }

    return newNotification.id;
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(
      notification => notification.id !== id
    );
  }

  clearAll() {
    this.notifications = [];
  }

  success(message: string, link?: NotificationLink, duration: number = 5000) {
    return this.addNotification({type: 'success', message, link, duration});
  }

  error(message: string, link?: NotificationLink, duration: number = 5000) {
    return this.addNotification({type: 'error', message, link, duration});
  }

  warning(message: string, link?: NotificationLink, duration: number = 5000) {
    return this.addNotification({type: 'warning', message, link, duration});
  }

  info(message: string, link?: NotificationLink, duration: number = 5000) {
    return this.addNotification({type: 'info', message, link, duration});
  }
}

export const notificationsStore = new NotificationsStore();