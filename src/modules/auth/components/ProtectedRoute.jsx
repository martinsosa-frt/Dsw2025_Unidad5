import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, allowedRoles }) {       //si no está autenticado lo manda de nuevo al login
  const { isAuthenticated, role } = useAuth();

  //No logueado -> al login
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  //Logueado pero sin el rol adecuado -> a la raíz (o donde quieras)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to='/' />;
  }

  //Logueado y con rol correcto
  return children;
};

export default ProtectedRoute;
