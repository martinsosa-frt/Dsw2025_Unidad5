function Input({ label, error = '', ...restProps }) {
  return (
    <div
      className='
        flex
        flex-col
        h-20
      '
    >
      <label>{label}:</label>
      <input className={error && 'border-red-400'} {...restProps} />
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>     //si el error no esta vacio agrega la clase border red 400 al input y muestra el mensaje en rojo abajo
  );
};

export default Input;
