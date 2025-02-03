import { useState } from "react";
import TablaTramitesBusqueda from "../../components/TablaTramitesBusqueda.components";
import useTramites from "../../hooks/useTramites.hook";

const TramitesAsignarReasignar = () => {
  const { tramitesRespuesta } = useTramites();

  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">
        Asignar o Reasignar Trámites
      </h2>
      <p className="text-xl mt-5 mb-4 text-center">
        Búsqueda Avanzada de{" "}
        <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <div className=" flex flex-col items-center">
        <TablaTramitesBusqueda tramiteBusqueda={tramitesRespuesta} />
      </div>
    </>
  );
};

export default TramitesAsignarReasignar;
