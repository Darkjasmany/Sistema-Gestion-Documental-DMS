import { useState } from "react";
import HeaderBusqueda from "../components/HeaderBusqueda.components";
import ListadoTramitesBusqueda from "../components/ListadoTramitesBusqueda.components";

const ConsultarTramites = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center md:block">
        <h2 className="font-black text-3xl text-center mt-10">
          Consultas de Trámites
        </h2>
        <p className="text-xl mt-5 mb-4 text-center">
          Búsqueda Avanzada de{" "}
          <span className="text-indigo-600 font-bold">Trámites</span>
        </p>

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
      </div>
      {/* <div className=" flex flex-col items-center"> */}
      <div className=" flex flex-col">
        <ListadoTramitesBusqueda />
      </div>
    </>
  );
};

export default ConsultarTramites;
