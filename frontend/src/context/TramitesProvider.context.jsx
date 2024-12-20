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
          // "Content-Type": "application/json", // Para indicar que el body es un JSON
          "Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
          Authorization: `Bearer ${token}`,
        },
      };

      // Como el backend recibe archivos, se debe enviar un FormData
      const formData = new FormData();
      formData.append("asunto", tramite.asunto);
      formData.append("descripcion", tramite.descripcion);
      formData.append(
        "departamentoRemitenteId",
        tramite.departamentoRemitenteId
      );
      formData.append("remitenteId", tramite.remitenteId);
      formData.append("prioridad", tramite.prioridad);
      formData.append("fechaDocumento", tramite.fechaDocumento);
      formData.append("referenciaTramite", tramite.referenciaTramite);
      formData.append("tramiteExterno", tramite.tramiteExterno);

      // Adjuntar archivos al FormData
      tramite.archivos.forEach((archivo) => {
        formData.append("archivos", archivo);
      });

      const { data } = await clienteAxios.post("/tramites", formData, config);
      console.log(data);

      // Va a crear un nuevo objeto con lo que no necesitamos
      const {
        activo,
        createdAt,
        id,
        usuario_actualizacion,
        usuario_creacion,
        ...tramiteAlmacenado
      } = data;

      console.log(tramiteAlmacenado);

      // Actualizar el state tomando lo que hay en tramites y agregando el nuevo tramite almacenado
      setTramites([tramiteAlmacenado, ...tramites]);
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
