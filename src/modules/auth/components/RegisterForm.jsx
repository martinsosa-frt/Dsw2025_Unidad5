import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';
import { registerErrorMessages } from '../helpers/registerBackendError';

function RegisterForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [policyErrors, setPolicyErrors] = useState([]); // errores de contraseña del back
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    criteriaMode: 'all',    //para que evalue todas las reglas en vez de parar en la primera
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {     //limpia los mensajes anteriores antes de registrar 
    setErrorMessage('');
    setSuccessMessage('');
    setPolicyErrors([]);

    // if (formData.password !== formData.confirmPassword) {
    //   setErrorMessage('Las contraseñas no coinciden');
    //   return;
    // }

    try {
      setIsSubmitting(true);

      const message = await registerService({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage(message || 'Usuario registrado correctamente');

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
      //volver al login después de un seg y medio
      // setTimeout(() => {
      //   navigate('/login');
      // }, 1500);
    } catch (error) {
      const data = error?.response?.data;

      if (Array.isArray(data)) {      // porque el back manda un array con los errores de la contraseña
        const messages = data.map((err) => {
          return registerErrorMessages[err.code] || err.description || 'Error de contraseña desconocido';
        });

        setPolicyErrors(messages);

      } else if (typeof data === 'string') {           //por si es un string simple
        setErrorMessage(data);
      } else if (data?.detail) {
        setErrorMessage(data.detail);
      } else {
        setErrorMessage('Error al registrar usuario');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackToLogin = () => {
    navigate('/login');
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-4
        bg-white
        p-8
        rounded-xl
        shadow-sm
        w-full
        sm:w-[400px]
      '
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className='text-center text-xl mb-2'>Registrar Usuario</h2>

      {/* USUARIO */}
      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />

      {/* EMAIL */}
      <Input
        label='Email'
        type='email'
        {...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Formato de email inválido',
          },  
        })}
        error={errors.email?.message}
      />

      {/* CONTRASEÑA */}
      <Input
        label='Contraseña'
        type='password'
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres',
          },
          validate: {
            hasUpper: (value) =>
              /[A-Z]/.test(value) || 'La contraseña debe tener al menos una letra mayúscula',
            hasDigit: (value) =>
              /\d/.test(value) || 'La contraseña debe tener al menos un número',
            hasSpecial: (value) =>
              /[^a-z0-9A-Z]/.test(value) || 'La contraseña debe tener al menos un carácter especial',
          },
        })}
        error=''
      />
      {/* mostrar errores de contraseña del FRONT (react-hook-form) */}
      {errors.password?.types && (
        <ul className="text-red-500 text-sm list-disc list-inside">
          {Object.values(errors.password.types).map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}

      {/* CONFIRMAR CONTRASEÑA */}
      <Input
        label='Confirmar contraseña'
        type='password'
        {...register('confirmPassword', {
          required: 'Debes confirmar la contraseña',
          validate: (value) =>
            value === getValues('password') || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      {/* errores generales */}

      {errorMessage && (
        <p className='text-red-500 text-sm'>{errorMessage}</p>
      )}

      {/* errores de la política de contraseña */}

      {policyErrors.length > 0 && (
        <ul className="text-red-500 text-sm list-disc list-inside">
          {policyErrors.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}

      {successMessage && (
        <p className='text-green-600 text-sm'>{successMessage}</p>
      )}

      <Button type='submit' className='mt-2' disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar'}
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
