import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();    //crea un contexto global de autenticacion

// 👇 helper para extraer el rol desde el JWT
function getRoleFromToken(token) {
  try {
    // Los JWT vienen como header.payload.signature
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return null;

    // Base64URL -> Base64 normal
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json);


    return payload.role || null;
  } catch (error) {
    console.error('No se pudo obtener el rol desde el token', error);
    return null;
  }
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {    //se inicializa leyendo el localstorage, si hay token es true si no es false
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const [role, setRole] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return getRoleFromToken(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    const decodedRole = getRoleFromToken(data);
    setRole(decodedRole);
    setIsAuthenticated(true);

    return { error: null, role: decodedRole };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        singin,
        singout,
        role,
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
