import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router";
import App from "./App";
import {userStore} from './entities/user';
import {fetchCurrentUser} from './entities/user/fetcher';
import UserLoader from './entities/user/UserLoader';
import {NotificationsContainer} from "./features/notifications/ui/NotificationsContainer";
import {NotificationsProvider} from "./features/notifications/NotificationsProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

async function bootstrap() {
  try {
    const path = typeof window !== 'undefined' && window.location && window.location.pathname ? window.location.pathname : '';
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');

    if (!onAuthPage) {
      await userStore.loadUserFromApi(fetchCurrentUser);
    }
  } catch (e) {
    console.error('Failed to load current user', e);
  }

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        {/* компонент, который будет динамически подгружать пользователя при навигации */}
        <UserLoader/>

        <NotificationsProvider>
          <NotificationsContainer/>
          <App/>
        </NotificationsProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap();

reportWebVitals();
