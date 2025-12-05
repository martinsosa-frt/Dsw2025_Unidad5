import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);    //accede al contexto

  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }
  
  return context;

};

export default useAuth;
