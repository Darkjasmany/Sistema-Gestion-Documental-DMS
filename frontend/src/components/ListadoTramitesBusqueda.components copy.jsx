import { useEffect, useState } from "react";
import useTramites from "../hooks/useTramites.hook";
import TablaTramitesBusqueda from "./TablaTramitesBusqueda.components";

const ListadoTramitesBusqueda = () => {
  const { tramitesRespuesta } = useTramites();
  const [dataLista, setDataLista] = useState([]);

  useEffect(() => {
    if (Array.isArray(tramitesRespuesta) && tramitesRespuesta.length > 0) {
      setDataLista(tramitesRespuesta);
    }
  }, [tramitesRespuesta]);

  console.log("📌 Trámites en estado:", dataLista);
  return (
    <>
      {/* {tramitesRespuesta.length ? ( */}
      {/* {Array.isArray(tramitesRespuesta) && tramitesRespuesta.length > 0 ? (
        <>
          <h2 className="font-black text-3xl text-center">
            Movimiento de Trámites
          </h2>

          <TablaTramitesBusqueda tramiteBusqueda={tramitesRespuesta ?? []} /> 
        </>*/}
      {dataLista.length > 0 ? (
        <>
          <h2 className="font-black text-3xl text-center">
            Movimiento de Trámites
          </h2>

          <TablaTramitesBusqueda tramiteBusqueda={dataLista} />
        </>
      ) : (
        <>
          <h2 className="font-black text-3xl text-center">No hay Támites</h2>
          <p className="text-xl mt-5 mb-10 text-center">
            Comienza agregando filtros personalizados{" "}
            <span className="text-indigo-600 font-bold">
              y aparareceran en este lugar
            </span>
          </p>
        </>
      )}
    </>
  );
};

export default ListadoTramitesBusqueda;
