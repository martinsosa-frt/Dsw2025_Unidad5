import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // <--- 1. IMPORTAR TOAST
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '', 
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  // 2. Definimos el estilo "Gigante" (Solo tamaño, sin colores fijos)
  const toastStyle = {
    padding: '16px',
    fontSize: "20px",
    minWidth: "300px",
  };

  const onValid = async (formData) => {
    // Limpiamos errores previos antes de intentar
    setErrorBackendMessage('');

    try {
      // Mapeamos los datos para que coincidan con tu JSON (cui -> internalCode)
      const payload = {
        ...formData,
        internalCode: formData.cui, 
      };

      await createProduct(payload);

      // --- 3. TOAST DE ÉXITO ---
      toast.success("Producto creado con éxito", {
        icon: "✅📦", // Icono de cajita
        duration: 3000,
        style: toastStyle,
      });

      // Esperamos 2 segunditos para que vean el mensaje antes de irse
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);

    } catch (error) {
      let msg = 'Error al crear el producto';

      // Lógica para obtener el mensaje exacto del error
      if (error.response?.data?.detail) {
        // Buscamos si tenemos una traducción amigable, sino usamos el mensaje del back
        msg = frontendErrorMessage[error.response.data.code] || 'Error de validación';
      } else if (error.message) {
        msg = error.message;
      }

      //setErrorBackendMessage(msg); // Muestra el texto rojo abajo del botón

      // --- 4. TOAST DE ERROR ---
      toast.error('Error al crear el producto', {
        style: toastStyle,
      });
    }
  };

  return (
    <Card>
      <form
        className='flex flex-col gap-20 p-8 sm:gap-4'
        onSubmit={handleSubmit(onValid)}
      >
        {/* --- VALIDACIÓN SKU (Exactamente 13 dígitos) --- */}
        <Input
          label='SKU'
          error={errors.sku?.message}
          placeholder="Ej: 7799988776655"
          {...register('sku', {
            required: 'SKU es requerido',
            pattern: {
              value: /^[0-9]{13}$/, 
              message: 'El SKU debe tener exactamente 13 números',
            }
          })}
        />

        {/* --- VALIDACIÓN CÓDIGO ÚNICO (Formato AAA-111) --- */}
        <Input
          label='Código Único'
          error={errors.cui?.message}
          placeholder="Ej: INT-047"
          {...register('cui', {
            required: 'Código Único es requerido',
            pattern: {
              value: /^[A-Z]{3}-\d{3}$/, 
              message: 'Formato inválido. Ejemplo: INT-047',
            },
          })}
        />

        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        
        <Input
          label='Descripción'
          {...register('description')}
        />
        
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          {...register('price', {
            min: {
              value: 0,
              message: 'No puede tener un precio negativo',
            },
          })}
        />
        
        <Input
          label='Stock'
          error={errors.stock?.message}
          {...register('stock', {
            min: {
              value: 0,
              message: 'No puede tener un stock negativo',
            },
          })}
        />

        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>
        
        {/* Mensaje de error persistente en texto rojo */}
        {errorBackendMessage && <span className='text-red-500 font-semibold mt-2 block'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
};

export default CreateProductForm;
