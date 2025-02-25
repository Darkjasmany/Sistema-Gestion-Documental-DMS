import { useEffect } from "react";
import useTramites from "../hooks/useTramites.hook";
import Tramite from "./Tramite.components";

const ListadoTramites = () => {
  const { tramites, obtenerTramites } = useTramites();

  useEffect(() => {
    obtenerTramites();
  }, [tramites, obtenerTramites]);

  // console.log(tramites);

  return (
    <>
      {tramites.length ? (
        <>
          <h2 className="font-black text-3xl text-center">Listado Trámites</h2>
          <p className="text-xl mt-5 mb-10 text-center">
            Administra tus{" "}
            <span className="text-indigo-600 font-bold">
              Trámites y Documentos
            </span>{" "}
          </p>
          {/* Vamos a iterar sobre los tramites del context, pero necesitamos definir una key para cada tramite, por lo que vamos a utilizar el id de cada tramite. Para ello, vamos a utilizar el método map de los arrays, que nos permite recorrer cada elemento de un array y devolver un nuevo array con los elementos transformados. En este caso, vamos a devolver un componente Tramite por cada tramite, y le vamos a pasar el tramite como prop. Para que React pueda identificar cada componente, le vamos a pasar el id del tramite como key. Finalmente, vamos a cerrar el fragment y el operador ternario. */}

          {tramites.map((tramite, index) => {
            return <Tramite key={tramite.id || index} tramite={tramite} />;
          })}
        </>
      ) : (
        <>
          <h2 className="font-black text-3xl text-center">No hay Trámites</h2>
          <p className="text-xl mt-5 mb-10 text-center">
            Comienza agregando trámites{" "}
            <span className="text-indigo-600 font-bold">
              y apareceran en este lugar
            </span>{" "}
          </p>
        </>
      )}
    </>
  );
};

export default ListadoTramites;
