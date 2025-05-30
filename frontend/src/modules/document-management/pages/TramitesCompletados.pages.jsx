import { useEffect, useState } from "react";
import TablaTramitesBusqueda from "../../../components/TablaTramitesBusqueda.components";
import useTramites from "../../../hooks/useTramites.hook";

const TramitesCompletados = () => {
  const { obtenerTramitesCoordinador, tramitesAsignarReasignar } =
    useTramites();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("POR_FIRMAR");
  const [refreshTable, setRefreshTable] = useState(false);

  const handleFiltro = (estado) => {
    setEstadoSeleccionado(estado);
    setRefreshTable(true); // Indicamos que cuando cambie el estado refresque la tabla
  };

  useEffect(() => {
    const datosTramites = async () => {
      try {
        await obtenerTramitesCoordinador(estadoSeleccionado);
      } catch (error) {
        console.error(error.message);
      } finally {
        setRefreshTable(false); // Restablecer el estado de actualización después de obtener los datos
      }
    };

    if (refreshTable) {
      // Solo obtiene los datos si es necesario actualizar
      datosTramites();
    } else {
      datosTramites(); // Obtiene los datos en el primer render
    }
  }, [estadoSeleccionado, refreshTable, obtenerTramitesCoordinador]);

  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">
        Aprobar los Trámites
      </h2>
      <p className="text-xl mt-5 mb-4 text-center">
        Búsqueda Avanzada de{" "}
        <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <div className=" flex flex-col gap-5">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded   ${
              estadoSeleccionado === "POR_FIRMAR"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("POR_FIRMAR")}
          >
            Por Firmar
          </button>
          <button
            className={`px-4 py-2 rounded   ${
              estadoSeleccionado === "COMPLETADO"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("COMPLETADO")}
          >
            Completados
          </button>
          <button
            className={`px-4 py-2 rounded   ${
              estadoSeleccionado === "FINALIZADO"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("FINALIZADO")}
          >
            Finalizados
          </button>
        </div>

        <TablaTramitesBusqueda
          tramiteBusqueda={tramitesAsignarReasignar}
          onTramiteUpdate={() => setRefreshTable(true)} // Pasa la función de actualización
        />
      </div>
    </>
  );
};

export default TramitesCompletados;
