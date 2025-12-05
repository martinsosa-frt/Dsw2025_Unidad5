import Button from './Button';
import useAuth from '../../auth/hook/useAuth';
import { IoIosCart } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";


export default function MobileSideMenu({
  isOpen,
  title = 'Menú',
  onClose,
  onGoCart,
  onGoProducts,
  onOpenLogin,
  onOpenRegister,
  totalItems = 0,
}) {
  const { isAuthenticated, user, singout } = useAuth();

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6
        transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        sm:hidden
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">{title}</h2>

        {isAuthenticated && user?.username && (
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.freepik.com/512/12225/12225935.png"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-sm truncate">{user.username}</span>
          </div>
        )}
      </div>

      {onGoProducts && (
        <Button className="text-xl mt-4 w-full" onClick={onGoProducts}>
          Ver productos
        </Button>
      )}

      {onGoCart && (
        <Button className="text-xl mt-4 w-full flex items-center justify-center gap-2" onClick={onGoCart}>
         <IoIosCart />Ver carrito ({totalItems})
        </Button>
      )}

      {!isAuthenticated ? (
        <>
          <Button className="text-xl mt-4 w-full" onClick={onOpenLogin}>
            Iniciar Sesión
          </Button>
          <Button className="text-xl mt-4 w-full" onClick={onOpenRegister}>
            Registrarse
          </Button>
        </>
      ) : (
        <Button className="text-xl mt-4 w-full flex items-center justify-center gap-2" onClick={() => { singout(); onClose(); }}>
        <MdLogout /> Cerrar sesión
        </Button>
      )}

      <Button className="text-xl mt-4 w-full flex items-center justify-center " onClick={onClose}>
       <IoMdArrowRoundBack /> Volver
      </Button>
    </div>
  );
}