function Input({ label, error = '', ...restProps }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-1
        mb-2
      "
    >
      {/* Label un poco más chico en mobile */}
      <label className="text-sm sm:text-base font-medium">
        {label}:
      </label>

      {/* Input con tamaño de texto más razonable en mobile */}
      <input
        className={`
          w-full
          px-3
          py-2
          text-sm sm:text-base
          ${error ? 'border-red-400' : ''}
        `}
        {...restProps}
      />

      {/* Error más compacto en mobile */}
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;