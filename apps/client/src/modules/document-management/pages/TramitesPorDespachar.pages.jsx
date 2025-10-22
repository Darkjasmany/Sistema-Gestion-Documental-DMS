import React, { useState, useEffect } from "react";
import TablaTramitesBusqueda from "../components/TablaTramitesBusqueda.components";
import useTramites from "../../../hooks/useTramites.hook";

const TramitesPorDespachar = () => {
  const { obtenerTramitesDespachadorData, tramitesDespachador } = useTramites();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("DESPACHADO");
  const [refreshTable, setRefreshTable] = useState(false);

  const handleFiltro = (estado) => {
    setEstadoSeleccionado(estado);
    setRefreshTable(true); // Indicamos que cuando cambie el estado refresque la tabla
  };

  useEffect(() => {
    const datosTramitesRevisor = async () => {
      try {
        await obtenerTramitesDespachadorData(estadoSeleccionado);
      } catch (error) {
        console.error(error.message);
      } finally {
        setRefreshTable(false);
      }
    };

    if (refreshTable) {
      datosTramitesRevisor();
    } else {
      datosTramitesRevisor();
    }
  }, [estadoSeleccionado, refreshTable, obtenerTramitesDespachadorData]);

  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">
        Trámites Por Despachar
      </h2>
      <p className="text-xl mt-5 mb-4 text-center">
        Despacha tus <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded  ${
              estadoSeleccionado === "DESPACHADO"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("DESPACHADO")}
          >
            Por Despachar
          </button>
          {/* <button
            className={`px-4 py-2 rounded  ${
              estadoSeleccionado === "POR_FINALIZAR"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("POR_FINALIZAR")}
          >
            Por Finalizar
          </button> */}
        </div>

        <TablaTramitesBusqueda
          tramiteBusqueda={tramitesDespachador}
          onTramiteUpdated={() => setRefreshTable(true)}
        />
      </div>
    </>
  );
};

export default TramitesPorDespachar;
