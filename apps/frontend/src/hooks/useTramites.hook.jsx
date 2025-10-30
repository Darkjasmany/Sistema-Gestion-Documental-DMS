import { useContext } from "react"; // Estraer los datos del Context
import TramitesContext from "../context/TramitesProvider.context"; //Indicar que context va a extraer datos

const useTramites = () => {
  return useContext(TramitesContext); // Indicamos el context para extraer
};

export default useTramites;
