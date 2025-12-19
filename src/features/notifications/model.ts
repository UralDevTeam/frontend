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
  onClose?: (() => void) | undefined;
  duration: number;
  createdAt: number;
}


const HISTORY_LIMIT = 50;


class NotificationsStore {
  notifications: Notification[] = [];
  history: Notification[] = [];

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {

    console.log(notification);

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };

    this.notifications.push(newNotification);
    this.history.unshift(newNotification);

    if (this.history.length > HISTORY_LIMIT) {
      this.history = this.history.slice(0, HISTORY_LIMIT);
    }

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

  clearHistory() {
    this.history = [];
  }

  success(message: string, link?: NotificationLink, duration: number = 5000, onClose?: () => void) {
    return this.addNotification({type: 'success', message, link, duration, onClose});
  }

  error(message: string, link?: NotificationLink, duration: number = 5000, onClose?: () => void) {
    return this.addNotification({type: 'error', message, link, duration, onClose});
  }

  warning(message: string, link?: NotificationLink, duration: number = 5000, onClose?: () => void) {
    return this.addNotification({type: 'warning', message, link, duration, onClose});
  }

  info(message: string, link?: NotificationLink, duration: number = 5000, onClose?: () => void) {
    return this.addNotification({type: 'info', message, link, duration, onClose});
  }
}

export const notificationsStore = new NotificationsStore();
