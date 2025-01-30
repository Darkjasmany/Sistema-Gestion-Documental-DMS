import useTramites from "../hooks/useTramites.hook";

const ListadoTramitesBusqueda = () => {
  const { tramitesRespuesta } = useTramites();

  console.log(tramitesRespuesta);
  return <div>ListadoTramitesBusqueda</div>;
};

export default ListadoTramitesBusqueda;
