import { useEffect, useState } from 'react';


// Componentes reutilizables del proyecto.
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

// Servicio que tiene que llamar al backend para obtener las ordenes.
import { getOrders } from '../services/listServices.js';


// Constante de estados posibles del las ordenes (filtro).
const orderStatus = {
  ALL: 'all',  // ordenes pendientes   
  PENDING: 'pending',  // ordenes pendientes      
  PROCESSING: 'processing', // ordenes en proceso
  SHIPPED: 'shipped', //ordenes enviadas
  DELIVERED: 'delivered', // ordenes entregadas
  CANCELLED: 'cancelled' // ordenes canceladas
};


function ListOrdersPage() {

  // -------------------------
  // Estados (useState)
  // -------------------------
  // Termino de búsqueda (lo actualiza el input).
  const [ searchTerm, setSearchTerm ] = useState('');

  // Estado del filtro de productos (all / pending / processing etc.).
  const [ status, setStatus ] = useState(orderStatus.ALL);

  // Paginación: número de página actual y tamaño por página.
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  // Datos devueltos por el backend: total de resultados y lista de productos visible.
  const [ total, setTotal ] = useState(0);
  const [ orders, setOrders ] = useState([]);

  // Indicador de carga mientras se hace la petición al backend.
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Función para obtener productos del backend
  // -------------------------
  const fetchOrders = async () => {
    try {
      setLoading(true); // poner spinner / loading en true

      // Llamada al servicio que obtiene productos con filtros y paginación.
      // Se asume que `getProducts` retorna un objeto con `data` y `error`.
      const { data, error } = await getOrders(searchTerm, status, pageNumber, pageSize);

      // Si la respuesta trae error, lanzarlo para ir al catch.
      if (error) throw error;

     
      setTotal(data.total);
      setOrders(data?.orderItems || []); // actualizar lista de productos (o array vacío si no hay)
    } catch (error) {
      // Captura y logueo de errores (podría mejorarse mostrando notificación al usuario).
      console.error(error);
    } finally {
      // Siempre se apaga el loading aunque falle la petición.
      setLoading(false);
    }
  };

  // -------------------------
  // useEffect para ejecutar la búsqueda cuando cambia la paginación o el estado del filtro
  // -------------------------
  useEffect(() => {
    // Ejecuta fetchProducts cuando `status`, `pageSize` o `pageNumber` cambian.
    // NOTA: `searchTerm` NO está en las dependencias a propósito, porque la búsqueda se hace con botón.
    fetchOrders();
  }, [status, pageSize, pageNumber]);

  // Cálculo del total de páginas para la paginación (redondeo hacia arriba).
  const totalPages = Math.ceil((total || 0) / pageSize) || 1;

  // Handler para el botón de búsqueda (ejecuta fetchProducts).
  const handleSearch = async () => {
    await fetchOrders();
  };

  // -------------------------
  // JSX: estructura de la UI
  // -------------------------
  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Ordenes</h1>

          {/* Botón visible sólo en pantallas pequeñas (icono) */}
          <Button className='h-11 w-11 rounded-2xl sm:hidden'>
            {/* Icono tipo más/crear (svg inline) */}
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g></svg>
          </Button>
        </div>

        {/* Fila con campo de búsqueda y selector de estado */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3'>
            {/* Campo de texto: mantiene `searchTerm` en estado local */}
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              type="text"
              placeholder='Buscar'
              className='text-[1.3rem] w-full'
            />

            {/* Botón que ejecuta la búsqueda */}
            <Button className='h-11 w-11' onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </Button>
          </div>

          {/* Selector que cambia el `status` (all / pending / processing etc.) */}
          <select onChange={evt => setStatus(evt.target.value)} className='text-[1.3rem]'>
            <option value={orderStatus.ALL}>Todas</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.PROCESSING}>En proceso</option>
            <option value={orderStatus.SHIPPED}>Enviadas</option>
            <option value={orderStatus.DELIVERED}>Entregadas</option>
            <option value={orderStatus.CANCELLED}>Canceladas</option>
          </select>
        </div>
      </Card>

      {/* Lista de productos o mensaje de carga */}
      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ? <span>Buscando datos...</span> // mostrado cuando `loading` true
            : orders.map(order => (
              <Card key={order.id}>
                  {/* CONTENEDOR PRINCIPAL FLEX: Separa izq y der */}
                  <div className="flex justify-between items-center gap-4">
                    
                    {/* COLUMNA IZQUIERDA: Información de texto */}
                    <div className="flex flex-col gap-1">
                      <h2><b>Id de orden:</b> {order.id}</h2>
                      <h1><b>Cliente: </b> {order.customerName}</h1>
                      <h2><b>Estado:</b> {order.orderStatus}</h2>
                      <h2><b>Total:</b> ${order.totalAmount}</h2>
                    </div>

                    {/* COLUMNA DERECHA: Botones */}
                    <div className="flex-shrink-0">
                      {/* Botón visible sólo en pantallas pequeñas (icono) */}
                      <Button className='h-11 w-11 rounded-2xl sm:hidden flex items-center justify-center'>
                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier"> 
                            <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> 
                            <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> 
                          </g>
                        </svg>
                      </Button>

                      {/* Botón visible en pantallas >= sm (texto "Ver Detalles") */}
                      <Button
                        className='hidden sm:block'
                        //onClick={() => navigate('/admin/orders/details/' + order.id)}
                      >
                        Ver Detalles
                      </Button>
                    </div>

                  </div>
                </Card>
              
            ))
        }
      </div>

      {/* Paginación simple con Prev / Next y select para tamaño de página */}
      <div className='flex justify-center items-center mt-3'>
        <button
          // desactiva retroceder si pageNumber es 1
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 disabled:bg-gray-100'
        >
          Atras
        </button>

        {/* Indicador página actual / totalPages */}
        <span>{pageNumber} / {totalPages}</span>

        <button
          // desactiva siguiente si pageNumber llega a totalPages
          disabled={ pageNumber === totalPages }
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 disabled:bg-gray-100'
        >
          Siguiente
        </button>

        {/* Select para cambiar tamaño de página.
            Al cambiar tamaño reseteamos a página 1 (comportamiento común). */}
        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value)); // Convertir value (string) a number
          }}
          className='ml-3'
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default ListOrdersPage;
