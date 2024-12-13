const Formulario = () => {
  return (
    <>
      <p className="text-lg text-center mb-10">
        Añade tus trámites y{" "}
        <span className="text-indigo-600 font-bold">Administralos</span>
      </p>
      <form action="">
        <div className="mb-5">
          <label htmlFor="asunto" className="text-gray-700 uppercase font-bold">
            Asunto
          </label>
          <input
            type="text"
            id="asunto"
            placeholder="Ingresa el asunto del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="descripcion"
            className="text-gray-700 uppercase font-bold"
          >
            Descripción
          </label>
          <input
            type="text"
            id="descripcion"
            placeholder="Ingresa la descripción del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="fechaDocumento"
            className="text-gray-700 uppercase font-bold"
          >
            Fecha del Trámite
          </label>
          <input
            type="date"
            id="fechaDocumento"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="referenciaTramite"
            className="text-gray-700 uppercase font-bold"
          >
            Descripción
          </label>
          <input
            type="text"
            id="referenciaTramite"
            placeholder="Ingresa la referencia del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>
      </form>
    </>
  );
};

export default Formulario;
