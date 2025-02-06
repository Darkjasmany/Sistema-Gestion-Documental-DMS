import { useState } from "react";

const NavTramites = ({ setFiltro }) => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("INGRESADO");

  const handleFiltro = (estado) => {
    setEstadoSeleccionado(estado);
    setFiltro(estado);
  };

  return (
    <div className="flex gap-4">
      <button
        className={`px-4 py-2 rounded   ${
          estadoSeleccionado === "INGRESADO"
            ? "bg-indigo-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => handleFiltro("INGRESADO")}
      >
        Asignar
      </button>
      <button
        className={`px-4 py-2 rounded   ${
          estadoSeleccionado === "PENDIENTE"
            ? "bg-indigo-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => handleFiltro("PENDIENTE")}
      >
        Reasignar
      </button>
    </div>
  );
};

export default NavTramites;
