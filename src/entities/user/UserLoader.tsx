import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { userStore } from './index';
import {routes} from '../../shared/routes';
import { fetchCurrentUser } from './fetcher';

export default function UserLoader(): null {
  const location = useLocation();
  const inFlightRef = useRef(false);

  useEffect(() => {
    const path = typeof window !== 'undefined' && window.location && window.location.pathname
      ? window.location.pathname
      : location.pathname ?? '';

    const onAuthPage = path.startsWith(routes.login()) || path.startsWith(routes.register()) || path.startsWith(routes.auth());

    if (onAuthPage) return;

    if (userStore.user || userStore.loading || inFlightRef.current) return;

    inFlightRef.current = true;
    userStore.loadUserFromApi(fetchCurrentUser).finally(() => {
      inFlightRef.current = false;
    });
  }, [location.pathname]);

  return null;
}

