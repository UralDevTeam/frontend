import React from 'react';
import {observer} from 'mobx-react-lite';
import {Notification} from "../model";
import {Link} from "react-router";
import {useNotifications} from "../context";

interface NotificationItemProps {
  notification: Notification;
}


export const NotificationItem = observer(({notification}: NotificationItemProps) => {
  const {type, message, link} = notification;
    const {removeNotification} = useNotifications();

    const handleClose = () => {
        removeNotification(notification.id);
        notification.onClose?.();
    };

  return (
    <div className={`notification ${type}`}>
        <button
            className="notification__close"
            type="button"
            onClick={handleClose}
            aria-label="Закрыть уведомление"
        >
            ×
        </button>
      <div className="notification__content">
        <div className="notification__message">{message}</div>
        {link && <Link to={link.href} className="notification__link">{link.text}</Link>}
      </div>
    </div>
  );
});
