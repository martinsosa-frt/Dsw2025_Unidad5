import { instance } from '../../shared/api/axiosInstance';

export const register = async ({ username, email, password }) => {
  // POST api/auth/register
  const response = await instance.post('api/auth/register', {
    username,
    email,
    password,
  });

  // en el backend la respuesta es texto plano tipo "Usuario ADMIN registrado"
  // axios lo guarda en response.data
  return response.data;
};
