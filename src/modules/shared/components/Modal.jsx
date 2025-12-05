export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN DE CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl hover:opacity-50"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

