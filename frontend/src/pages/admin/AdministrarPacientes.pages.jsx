import Formulario from "../../components/Formulario.components";
import ListadoPacientes from "../../components/ListadoPacientes.components";

const AdministrarPacientes = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 lg:w-2/5">
        <Formulario />
      </div>
      <div className="md:w-1/2 lg:w-3/5">
        <ListadoPacientes />
      </div>
    </div>
  );
};

export default AdministrarPacientes;
