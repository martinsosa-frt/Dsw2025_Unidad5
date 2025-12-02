import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const message = await registerService({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // message normalmente será "Usuario ADMIN registrado" o similar
      setSuccessMessage(message || 'Usuario registrado correctamente');

      // opcional: volver al login después de un ratito
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      // acá capturamos errores del backend
      if (error?.response?.data) {
        // puede ser texto plano o un objeto con .detail
        const data = error.response.data;
        if (typeof data === 'string') {
          setErrorMessage(data);
        } else if (data.detail) {
          setErrorMessage(data.detail);
        } else {
          setErrorMessage('Error al registrar usuario');
        }
      } else {
        setErrorMessage('Error de conexión. Intente nuevamente o contacte a soporte.');
      }
    }
  };

  const goBackToLogin = () => {
    navigate('/login');
  };

  return (
    <form
      className="
        flex
        flex-col
        gap-4
        bg-white
        p-8
        rounded-xl
        shadow-sm
        w-full
        sm:w-[400px]
      "
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className='text-center text-xl mb-2'>Registrar Usuario</h2>

      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />

      <Input
        label='Email'
        type='email'
        {...register('email', {
          required: 'Email es obligatorio',
        })}
        error={errors.email?.message}
      />

      <Input
        label='Contraseña'
        type='password'
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres',
          },
        })}
        error={errors.password?.message}
      />

      <Input
        label='Confirmar contraseña'
        type='password'
        {...register('confirmPassword', {
          required: 'Debes confirmar la contraseña',
        })}
        error={errors.confirmPassword?.message}
      />

      {errorMessage && (
        <p className='text-red-500 text-sm'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='text-green-600 text-sm'>{successMessage}</p>
      )}

      <Button type='submit' className='mt-2'>
        Registrar
      </Button>

      <Button
        type='button'
        variant='secondary'
        className='mt-2'
        onClick={goBackToLogin}
      >
        Volver a Iniciar Sesión
      </Button>
    </form>
  );
}

export default RegisterForm;
