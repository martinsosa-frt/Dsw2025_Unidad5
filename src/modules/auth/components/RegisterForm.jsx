import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // <--- 1. Importante: Importar toast
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';
import { registerErrorMessages } from '../helpers/registerBackendError';

function RegisterForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [policyErrors, setPolicyErrors] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    criteriaMode: 'all',    
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  // Estilos compartidos para los Toasts (para no repetir código)
  const toastStyle = {
    padding: '16px',         
    fontSize: "20px",
    minWidth: "300px",
  };

  const onValid = async (formData) => {     
    setErrorMessage('');
    setSuccessMessage('');
    setPolicyErrors([]);

    try {
      setIsSubmitting(true);

      const message = await registerService({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Usuario registrado correctamente", {
        icon: "✅👤",
        duration: 3000,
        style: {
        toastStyle      
        }
      });
      // --------------------------------------------------

      setSuccessMessage(message || 'Usuario registrado correctamente');

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate('/login');
        }, 1500); // Espera un poquito para que se vea el mensaje
      }
     
    } catch (error) {
      const data = error?.response?.data;

      const showErrorToast = (msg) => {
        toast.error(msg, {
          style: {
          toastStyle
          }
        });
      };

      if (Array.isArray(data)) {      
        const messages = data.map((err) => {
          return registerErrorMessages[err.code] || err.description || 'Error de contraseña desconocido';
        });
        setPolicyErrors(messages);
        showErrorToast("Verifique los requisitos de la contraseña");

      } else if (typeof data === 'string') {           
        setErrorMessage(data);
        showErrorToast(data);

      } else if (data?.detail) {
        setErrorMessage(data.detail);
        showErrorToast(data.detail);

      } else {
        setErrorMessage('Error al registrar usuario');
        showErrorToast('Error al registrar usuario');
      }
      // ------------------------------------------------

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
        p-4
        rounded-xl
        shadow-sm
        w-full
        sm:p-8
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
      
      {/* Lista de errores de contraseña (Front) */}
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

      {/* Errores generales (Back) */}
      {errorMessage && (
        <p className='text-red-500 text-sm'>{errorMessage}</p>
      )}

      {/* Errores de políticas de contraseña (Back) */}
      {policyErrors.length > 0 && (
        <ul className="text-red-500 text-sm list-disc list-inside">
          {policyErrors.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}

      {/* Mensaje de éxito en texto (además del toast) */}
      {successMessage && (
        <p className='text-green-600 text-sm'>{successMessage}</p>
      )}

      <Button type='submit' className='mt-4 w-full py-2 text-sm sm:py-3 sm:text-base' disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar'}
      </Button>

      <Button
        type='button'
        variant='secondary'
        className='mt-2 w-full py-2 text-sm sm:py-3 sm:text-base'
        onClick={goBackToLogin}
      >
        Volver a Iniciar Sesión
      </Button>
    </form>
  );
}

export default RegisterForm;
