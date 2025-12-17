import React, { ReactNode } from 'react';
import { NotificationsContext } from './context';
import {notificationsStore} from "./model";
import {NotificationsContainer} from "./ui/NotificationsContainer";

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  return (
    <NotificationsContext.Provider value={notificationsStore}>
      {children}
      <NotificationsContainer />
    </NotificationsContext.Provider>
  );
};