import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router";
import App from "./App";
import {userStore} from './entities/user';
import {fetchCurrentUser} from './entities/user/fetcher';
import UserLoader from './entities/user/UserLoader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// блокирующий bootstrap: ждём загрузки текущего пользователя, затем рендерим приложение
async function bootstrap() {
  try {
    // Если мы на странице авторизации — не выполняем блокирующую загрузку здесь.
    const path = typeof window !== 'undefined' && window.location && window.location.pathname ? window.location.pathname : '';
    const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');

    if (!onAuthPage) {
      await userStore.loadUserFromApi(fetchCurrentUser);
    }
  } catch (e) {
    // loadUserFromApi внутри себя выставляет error, но логируем для диагностики
    console.error('Failed to load current user', e);
  }

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        {/* компонент, который будет динамически подгружать пользователя при навигации */}
        <UserLoader />
        <App/>
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
