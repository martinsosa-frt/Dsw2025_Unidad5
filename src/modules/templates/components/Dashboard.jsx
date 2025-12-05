import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';
// Te sugiero importar iconos para los otros links también
import { FaHouse, FaBoxOpen, FaClipboardList } from "react-icons/fa6"; 
import { MdLogout } from "react-icons/md";

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { singout } = useAuth();

  const logout = () => {
    singout();
    navigate('/login');
  };

  
  const getLinkStyles = ({ isActive }) => (
    `
      w-full pl-4 pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
      flex items-center gap-2 
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );


  const renderLogoutButton = (mobile = false) => (
    <Button 
      className={`
        flex items-center justify-center gap-2 
        ${mobile 
          ? 'w-full sm:hidden'
          : 'hidden sm:flex'  
        }
      `} 
      onClick={logout}
    >
      <MdLogout/>
      Cerrar sesión
    </Button>
  );

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] sm:gap-3 sm:grid-cols-[256px_1fr]">
      
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 shadow rounded bg-white sm:col-span-2">
        <span>Administracion</span>
        {renderLogoutButton()}
        <button
          className="bg-transparent border-none shadow-none sm:hidden"
          onClick={() => setOpenMenu(!openMenu)}
        >
          { openMenu ? <span>&#215;</span> : <span>&#9776;</span>}
        </button>
      </header>

      {/* ASIDE / SIDEBAR */}
      <aside
        className={`
          absolute top-0 bottom-0 bg-white w-64 p-6
          ${openMenu ? 'left-0' : 'left-[-256px]'}
          rounded shadow flex flex-col justify-between
          sm:relative sm:left-0
        `}
      >
        <nav>
          <ul className='flex flex-col gap-2'> {/* Agregué gap-2 aquí para separar los botones entre sí */}
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              >
                {/* Ahora esto se verá alineado */}
                <FaHouse /> Principal
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >
                {/* Sugerencia de icono */}
                <FaBoxOpen /> Productos
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >
                {/* Sugerencia de icono */}
                <FaClipboardList /> Ordenes
              </NavLink>
            </li>
          </ul>
          <hr className='opacity-15 mt-4' />
        </nav>
        {renderLogoutButton(true)}
      </aside>

      <main className="p-5 overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
