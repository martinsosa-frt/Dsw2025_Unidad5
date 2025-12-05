import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

function LoginForm({onSuccess, onGoRegister}) {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

  // Estilos SOLO de tamaño (sin colores)
  const toastStyle = {
    padding: '16px',        // Mantiene el "aire"
    fontSize: "20px",       // Mantiene la letra grande
    minWidth: "300px",      // Mantiene el ancho
  };

  const goToRegister = () => {
    if (onGoRegister) {
      onGoRegister();
    } else {
      navigate('/register');
    }
  }

  const onValid = async (formData) => {
    try {
      const { error, role } = await singin(formData.username, formData.password);

      if (error) {
        const msg = error.frontendErrorMessage || 'Error al iniciar sesion';
        setErrorMessage(msg);
        
        // Toast de Error (sin color de fondo forzado)
        toast.error(msg, {
          style: toastStyle, // Solo aplica tamaño
        });
        return;
      }

      // Toast de Bienvenida (sin color de fondo forzado)
      toast.success(`¡Bienvenido, ${formData.username}!`, {
        icon: "👋😎", 
        duration: 3000,
        style: toastStyle, 
      });

      if (onSuccess) {
        onSuccess();
      } 
      
      if (role === 'Admin'){
        navigate('/admin/home');
      } else {
        if (!onSuccess) {
          navigate('/');
        }
      }

    } catch (error) {
      console.error(error.response.data);
      let msg = error.response.data || 'Error al iniciar sesión';
      if (error?.response?.data?.code) {
        msg = frontendErrorMessage[error?.response?.data?.code];
      }
      //setErrorMessage(msg);
      
      toast.error(msg, {
        style: toastStyle,
      });
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
        icon={<FaUser />}
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        icon={<RiLockPasswordFill />}
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
