import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm({onSuccess}) {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

  const goToRegister = () => {
    navigate('/register');
  }

  const onValid = async (formData) => {
    try {
      const { error, role } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Error al iniciar sesion');
        return;
      }
      // Si el padre pasó onSuccess (por ej., el modal en "/"), lo llamamos
      // para que cierre el modal o haga lo que necesite.
      if (onSuccess) {
        onSuccess();
      } 
      
      // Navegación según el rol
      if (role === 'Admin'){
        navigate('/admin/home');
      }else {
        // User (u otro rol)
        // - Si estamos en /login (no hay onSuccess) -> mandar a '/'
        // - Si estamos en "/" usando modal (sí hay onSuccess) -> ya estamos en '/', no hace falta navegar
        if (!onSuccess) {
        navigate('/');
        }
      }

    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-4
        bg-white
        p-4
        w-full max-w-md
        mx-auto
        sm:p-8
        sm:gap-6
        sm:rounded-lg
        sm:shadow-lg
      '
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        {...register('password', {
          required: 'Contraseña es obligatorio',
        })}
        type='password'
        error={errors.password?.message}
      />

      <Button
        type='submit'
        className='mt-2 w-full py-2 text-sm sm:py-3 sm:text-base'
      >
        Iniciar Sesión
      </Button>

      <Button
        variant='secondary'
        type='button'
        onClick={goToRegister}
        className="mt-2 w-full py-2 text-sm sm:py-3 sm:text-base"
      >
        Registrar Usuario
      </Button>

      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
