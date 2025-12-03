import { instance } from '../../shared/api/axiosInstance';

export const register = async ({ username, email, password }) => {
  // POST api/auth/register
  const response = await instance.post('api/auth/register', {
    username,
    email,
    password,
  });

  // axios guarda en response.data la respuesta del back "usuario registrado correctamente"
  return response.data;
};
