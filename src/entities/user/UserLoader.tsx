import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { userStore } from './index';
import { fetchCurrentUser } from './fetcher';

// Компонент запускает загрузку текущего пользователя при навигации на защищённые страницы.
export default function UserLoader(): null {
  const location = useLocation();
  const inFlightRef = useRef(false);

  useEffect(() => {
    const path = typeof window !== 'undefined' && window.location && window.location.pathname
      ? window.location.pathname
      : location.pathname ?? '';

    const onAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth');

    // Если мы на auth-странице — ничего не делаем
    if (onAuthPage) return;

    // Если уже есть пользователь или загрузка в процессе — не запускаем
    if (userStore.user || userStore.loading || inFlightRef.current) return;

    inFlightRef.current = true;
    // Запускаем загрузку и сбрасываем флаг по завершению
    userStore.loadUserFromApi(fetchCurrentUser).finally(() => {
      inFlightRef.current = false;
    });
  }, [location.pathname]);

  return null;
}

