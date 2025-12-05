import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);    //accede al contexto

  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  //const { isAuthenticated, singin, singout, role } = context;

  const { isAuthenticated, singin, singout, role } = context;

  return {
    isAuthenticated,
    singin,
    singout,
    role,
    isAdmin: role === 'Admin',
    isUser: role === 'User',
  };
  // return {
  //   isAuthenticated: context.isAuthenticated,
  //   singin: context.singin,
  //   singout: context.singout,
  //   role: context.role,    
  //   // estos helpers te simplifican la vida en los componentes
  //   isAdmin: role === 'Admin',    
  //   isUser: role === 'User',
  // };
};

export default useAuth;
