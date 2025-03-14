import { useEffect, useState } from "react";
import TablaTramitesBusqueda from "../../components/TablaTramitesBusqueda.components";
import useTramites from "../../hooks/useTramites.hook";

const TramitesAsignarReasignar = () => {
  const { obtenerTramitesCoordinador, tramitesAsignarReasignar } =
    useTramites();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("INGRESADO");
  const [refreshTable, setRefreshTable] = useState(false); // Estado para refrescar la tabla

  const [contadorAsignar, setContadorAsignar] = useState(0);
  const [contadorReasignar, setContadorReasignar] = useState(0);

  const handleFiltro = (estado) => {
    setEstadoSeleccionado(estado);
    setRefreshTable(true); // Indicamos que cuando cambie el estado refresque la tabla
  };

  useEffect(() => {
    const datosTramites = async () => {
      try {
        const data = await obtenerTramitesCoordinador(estadoSeleccionado);

        // console.log(data?.length);

        if (estadoSeleccionado === "INGRESADO")
          setContadorAsignar(data?.length || 0);

        if (estadoSeleccionado === "PENDIENTE")
          setContadorReasignar(data?.length || 0);
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
        Asignar o Reasignar Trámites
      </h2>
      <p className="text-xl mt-5 mb-4 text-center">
        Búsqueda Avanzada de{" "}
        <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <div className=" flex flex-col gap-5">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded   ${
              estadoSeleccionado === "INGRESADO"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("INGRESADO")}
          >
            Asignar: <span className="font-bold">{contadorAsignar}</span>
          </button>
          <button
            className={`px-4 py-2 rounded   ${
              estadoSeleccionado === "PENDIENTE"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleFiltro("PENDIENTE")}
          >
            Reasignar: <span className="font-bold">{contadorReasignar}</span>
          </button>
        </div>

        <TablaTramitesBusqueda
          tramiteBusqueda={tramitesAsignarReasignar}
          onTramiteUpdated={() => setRefreshTable(true)} // Pasa la función de actualización
        />
      </div>
    </>
  );
};

export default TramitesAsignarReasignar;
