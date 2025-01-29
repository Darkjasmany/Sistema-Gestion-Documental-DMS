import { useState } from "react";
import HeaderBusqueda from "../../components/HeaderBusqueda.components";
import ListadoTramitesBusqueda from "../../components/ListadoTramitesBusqueda.components";

const ConsultarTramites = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center md:block">
        {/* <div> */}
        <button
          type="button"
          className="bg-indigo-600  text-white font-bold uppercase mx-10 p-3 rounded-md mb-10 md:hidden"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario); // Para quecada vez que se presione haga lo contrario de mostrar formulario
          }}
        >
          {mostrarFormulario ? "Ocultar Formulario" : "Mostrar Formulario"}
        </button>
        <div
          className={`${
            mostrarFormulario ? "block" : "hidden"
          } md:block  mb-10`}
        >
          <HeaderBusqueda />
        </div>

        <div className="md:w-1/2 lg:w-3/5">
          <ListadoTramitesBusqueda />
        </div>
      </div>
    </>
  );
};

export default ConsultarTramites;
