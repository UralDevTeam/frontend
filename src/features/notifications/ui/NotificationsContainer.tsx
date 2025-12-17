import React from 'react';
import { observer } from 'mobx-react-lite';
import {useNotifications} from "../context";
import {NotificationItem} from "./NotificationItem";
import "./notifications.css"

export const NotificationsContainer = observer(() => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
});