import { Navigate, Outlet, useLocation } from 'react-router';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../features/auth/model';
import { routes } from '../routes';

function ProtectedRoute() {
  const location = useLocation();

  if (!authStore.isAuthenticated) {
    return (
      <Navigate to={routes.login()} state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}

export default observer(ProtectedRoute);
