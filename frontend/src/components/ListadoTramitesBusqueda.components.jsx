import useTramites from "../hooks/useTramites.hook";

const ListadoTramitesBusqueda = () => {
  const { tramites } = useTramites();

  console.log(tramites);
  return <div>ListadoTramitesBusqueda</div>;
};

export default ListadoTramitesBusqueda;
