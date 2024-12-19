import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios.config";

const TramitesContext = createContext();

// De donde vienen los datos
export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);

  const guardarTramite = async (tramite) => {
    console.log(tramite);
    try {
      // ** Cuando es una petición POST, que requiere autenticación se debe enviar el token en la configuracion en el header
      const token =
        localStorage.getItem("dms_token") ||
        sessionStorage.getItem("dms_token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post("/tramites", tramite, config);
      console.log(data);
    } catch (error) {
      console.error(error.response?.data?.mensaje);
    }
  };

  return (
    // Value: indicamos que va a ser un objeto que sera disponible y le pasamos el estado tramites
    <TramitesContext.Provider value={{ tramites, guardarTramite }}>
      {children}
    </TramitesContext.Provider>
  );
};

export default TramitesContext;
