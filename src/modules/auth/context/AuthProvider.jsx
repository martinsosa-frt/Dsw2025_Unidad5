import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();    //crea un contexto global de autenticacion

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {    //se inicializa leyendo el localstorage, si hay token es true si no es false
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        singin,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
