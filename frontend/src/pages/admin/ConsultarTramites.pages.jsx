const ConsultarTramites = () => {
  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">
        Consultas de Trámites
      </h2>

      <p className="text-xl mt-5 mb-10 text-center">
        Busqueda Avanzada de{" "}
        <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <div className="max-w-8xl mx-auto">
        <form
          action=""
          className="bg-white shadow-lg rounded-lg py-8 px-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Número de Trámite */}
            <div>
              <label
                htmlFor="numeroTramite"
                className="block text-gray-700 font-medium mb-1"
              >
                Número de Trámite:
              </label>
              <input
                type="number"
                id="numeroTramite"
                name="numeroTramite"
                placeholder="Número de Trámite"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Oficio Remitente */}
            <div>
              <label
                htmlFor="oficioRemitente"
                className="block text-gray-700 font-medium mb-1"
              >
                Número de Oficio/Memo:
              </label>
              <input
                type="text"
                id="oficioRemitente"
                name="oficioRemitente"
                placeholder="Número Oficio/Memo"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Asunto */}
            <div>
              <label
                htmlFor="asunto"
                className="block text-gray-700 font-medium mb-1"
              >
                Asunto del Trámite:
              </label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                placeholder="Asunto"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Fecha Documento */}
            <div>
              <label
                htmlFor="fechaDocumento"
                className="block text-gray-700 font-medium mb-1"
              >
                Fecha del Documento:
              </label>
              <input
                type="date"
                id="fechaDocumento"
                name="fechaDocumento"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Departamento Remitente */}
            <div>
              <label
                htmlFor="departamentoRemitenteId"
                className="block text-gray-700 font-medium mb-1"
              >
                Departamento Remitente:
              </label>
              <select
                name="departamentoRemitenteId"
                id="departamentoRemitenteId"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione un departamento</option>
                <option value="1">Sistemas</option>
              </select>
            </div>

            {/* Remitente */}
            <div>
              <label
                htmlFor="remitenteId"
                className="block text-gray-700 font-medium mb-1"
              >
                Remitente:
              </label>
              <select
                name="remitenteId"
                id="remitenteId"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione un remitente</option>
                <option value="1">Jasmany</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label
                htmlFor="prioridad"
                className="block text-gray-700 font-medium mb-1"
              >
                Prioridad:
              </label>
              <select
                name="prioridad"
                id="prioridad"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-gray-700 font-medium mb-1"
              >
                Descripción del Trámite:
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                placeholder="Descripción"
                className="w-full border-gray-300 rounded-md h-10 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white w-full md:w-1/4 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>
    </>
  );
};

export default ConsultarTramites;
