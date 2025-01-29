import { useState } from "react";
import HeaderBusqueda from "../../components/HeaderBusqueda.components";

const ConsultarTramites = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    // <div className="flex flex-col ">
    <div>
      <button
        type="button"
        className="bg-indigo-600  text-white font-bold uppercase mx-10 p-3 rounded-md mb-10 md:hidden"
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario); // Para quecada vez que se presione haga lo contrario de mostrar formulario
        }}
      >
        {mostrarFormulario ? "Ocultar Formulario" : "Mostrar Formulario"}
      </button>
      <div className={`${mostrarFormulario ? "block" : "hidden"} md:block `}>
        <HeaderBusqueda />
      </div>
    </div>
  );
};

export default ConsultarTramites;
