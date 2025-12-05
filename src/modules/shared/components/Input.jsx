function Input({ label, icon, error = '', ...restProps }) { // 1. Agregamos 'icon'
  return (
    <div
      className="
        flex
        flex-col
        gap-1
        mb-2
      "
    >
      {/* 2. Convertimos el label en Flex para alinear ícono y texto */}
      <label className="text-sm sm:text-base font-medium flex items-center gap-2">
        
        {/* 3. Si existe el ícono, lo mostramos */}
        {icon && (
          <span className="text-gray-500 text-lg">
            {icon}
          </span>
        )}
        
        {label}:
      </label>

      <input
        className={`
          w-full
          px-3
          py-2
          text-sm sm:text-base
          border rounded-md outline-none focus:ring-2 focus:ring-purple-300 transition
          ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300'}
        `}
        {...restProps}
      />

      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;