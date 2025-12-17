import { createContext, useContext } from 'react';
import {notificationsStore} from "./model";

export const NotificationsContext = createContext(notificationsStore);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};