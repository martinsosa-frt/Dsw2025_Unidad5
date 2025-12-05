import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

// 👇 Helper para extraer el rol desde el JWT (Aporte de tu compañero)
function getRoleFromToken(token) {
  try {
    if (!token) return null;
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return null;

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
  // 1. Estado del USUARIO (Tu lógica: ID y Username)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    // Si hay token, reconstruimos el usuario
    return token ? { username, userId } : null; 
  });

  // 2. Estado del ROL (Lógica de tu compañero)
  const [role, setRole] = useState(() => {
    const token = localStorage.getItem('token');
    return getRoleFromToken(token);
  });

  // 3. Estado derivado: Si hay usuario, está autenticado
  const isAuthenticated = !!user;

  const singout = () => {
    localStorage.clear();
    setUser(null); // Limpiamos usuario
    setRole(null); // Limpiamos rol
  };

  const singin = async (username, password) => {
    // data viene del backend como: { token: "...", username: "...", userId: "..." }
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    // Guardamos en LocalStorage
    localStorage.setItem('token', data.token); // OJO: Usamos data.token
    localStorage.setItem('username', data.username);
    localStorage.setItem('userId', data.userId);

    // Decodificamos el rol usando el TOKEN que vino dentro del objeto data
    const decodedRole = getRoleFromToken(data.token);

    // Actualizamos estados
    setUser({ username: data.username, userId: data.userId });
    setRole(decodedRole);

    return { error: null, role: decodedRole };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user, 
        role,
        singin,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };