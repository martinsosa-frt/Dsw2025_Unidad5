// src/auth/modals/RegisterModal.jsx
import Modal from '../../shared/components/Modal';
import RegisterForm from '../../auth/components/RegisterForm';

export default function RegisterModal({ isOpen, onClose }) {

  const openLoginModal = () => {
    onClose(); // cierro modal de registro
    window.dispatchEvent(new Event('open-login')); // abro el de login
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>

      <RegisterForm
        fixedRole="Client"  // ← siempre cliente    NOTA: RegisterForm no recibe ni usa esta prop
        onSuccess={onClose}
        onGoBackToLogin={openLoginModal} // botón "Volver a Iniciar Sesión"
      />

      {/* <p className="text-center text-sm mt-4">
        ¿Ya tienes cuenta?
        <button
          className="text-blue-600 ml-1"
          onClick={openLoginModal}
        >
          Inicia sesión
        </button>
      </p> */}
    </Modal>
  );
}
