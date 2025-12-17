import React from 'react';
import {observer} from 'mobx-react-lite';
import {Notification} from "../model";
import {Link} from "react-router";

interface NotificationItemProps {
  notification: Notification;
}


export const NotificationItem = observer(({notification}: NotificationItemProps) => {
  const {type, message, link} = notification;

  return (
    <div className={`notification ${type}`}>
      <div className="notification__content">
        <div className="notification__message">{message}</div>
        {link && <Link to={link.href} className="notification__link">{link.text}</Link>}
      </div>
    </div>
  );
});