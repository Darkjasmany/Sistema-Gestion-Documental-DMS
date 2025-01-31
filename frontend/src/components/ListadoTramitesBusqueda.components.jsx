import useTramites from "../hooks/useTramites.hook";
import TablaTramitesBusqueda from "./TablaTramitesBusqueda.components";

const ListadoTramitesBusqueda = () => {
  const { tramitesRespuesta } = useTramites();

  console.log(tramitesRespuesta);
  return (
    <>
      {tramitesRespuesta.length ? (
        <>
          {/* <h2 className="font-black text-3xl text-center">
            Movimiento de Trámites
          </h2> */}

          <TablaTramitesBusqueda tramiteBusqueda={tramitesRespuesta} />
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
