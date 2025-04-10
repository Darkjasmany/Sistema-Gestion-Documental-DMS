import React from "react";

const FiltroBusqueda = ({ filtroTexto, setFiltroTexto }) => {
  return (
    <div className="flex items-center w-full">
      <input
        type="text"
        placeholder="Buscar trámite por número, fecha del documento, oficio remitente, asunto, remitente, departamento remitente."
        className="border border-gray-300 w-full rounded-lg shadow-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        value={filtroTexto}
        onChange={(e) => setFiltroTexto(e.target.value)}
      />
    </div>
  );
};

export default FiltroBusqueda;
