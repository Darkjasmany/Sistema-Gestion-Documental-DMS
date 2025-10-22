import { useContext } from "react"; // Estraer los datos del Context
import AuthContext from "../context/AuthProvider.context"; //Indicar que context va a extraer datos

const useAuth = () => {
  return useContext(AuthContext); // Indicamos el context para extraer
};

export default useAuth;
