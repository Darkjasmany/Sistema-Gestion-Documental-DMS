import { useState } from "react";
import TablaTramitesBusqueda from "../../components/TablaTramitesBusqueda.components";
import useTramites from "../../hooks/useTramites.hook";
import NavTramites from "../../components/NavTramites.components";

const TramitesAsignarReasignar = () => {
  const { tramitesRespuesta } = useTramites();
  const { filtro, setFiltro } = useState("INGRESADO");

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
        <NavTramites setFiltro={filtro} />
        <TablaTramitesBusqueda tramiteBusqueda={tramitesRespuesta} />
      </div>
    </>
  );
};

export default TramitesAsignarReasignar;
