import { useEffect, useState } from "react";
import TablaTramitesBusqueda from "../../components/TablaTramitesBusqueda.components";
import useTramites from "../../hooks/useTramites.hook";
// import NavTramites from "../../components/NavTramites.components";
// import clienteAxios from "../../config/axios.config";

const TramitesAsignarReasignar = () => {
  const { obtenerTramitesCoordinador, tramitesAsignarReasignar } =
    useTramites();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("INGRESADO");

  const handleFiltro = (estado) => {
    setEstadoSeleccionado(estado);
  };

  useEffect(() => {
    const datosTramites = async () => {
      try {
        await obtenerTramitesCoordinador(estadoSeleccionado);
      } catch (error) {
        console.error(error.message);
      }
    };

    datosTramites();
  }, [estadoSeleccionado]);

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

        <TablaTramitesBusqueda tramiteBusqueda={tramitesAsignarReasignar} />
      </div>
    </>
  );
};

export default TramitesAsignarReasignar;
