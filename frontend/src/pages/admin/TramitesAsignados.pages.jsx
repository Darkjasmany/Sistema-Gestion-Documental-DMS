import { useState } from "react";
import useTramites from "../../hooks/useTramites.hook";
import TablaTramitesBusqueda from "../../components/TablaTramitesBusqueda.components";

const TramitesAsignados = () => {
  const { completarTramiteRevisor, tramitesRevisor } = useTramites();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("PENDIENTE");
  const [refreshTable, setRefreshTable] = useState(false);

  const handleFiltro = (estado) => {
    setEstadoSeleccionado(estado);
    setRefreshTable(true);
  };

  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">
        Trámites Asignados
      </h2>
      <p className="text-xl mt-5 mb-4 text-center">
        Completa tus <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded  ${
              estadoSeleccionado === "PENDIENTE"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("PENDIENTE")}
          >
            Asignados
          </button>
          <button
            className={`px-4 py-2 rounded  ${
              estadoSeleccionado === "POR_REVISAR"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("POR_REVISAR")}
          >
            Completados
          </button>
        </div>

        <TablaTramitesBusqueda
          tramiteBusqueda={tramitesRevisor}
          onTramiteUpdated={() => setRefreshTable(true)}
        />
      </div>
    </>
  );
};

export default TramitesAsignados;
