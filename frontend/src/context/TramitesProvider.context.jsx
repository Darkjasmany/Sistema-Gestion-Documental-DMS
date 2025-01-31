import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios.config";
import useAuth from "../hooks/useAuth.hook";

const TramitesContext = createContext();

// De donde vienen los datos
export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);
  const [tramitesRespuesta, setTramitesRespuesta] = useState([]);
  const [tramite, setTramite] = useState({});
  const { auth } = useAuth();

  // Obtener el token
  const token =
    localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

  // ** Cuando es una petición POST, PUT, DELETE, que requiere autenticación se debe enviar el token en la configuracion en el header ya que mi middleware checkAuth valida que el token sea valido y sea un usuario existente
  // Configuración de Axios centralizada
  const getAxiosConfig = () => {
    return {
      headers: {
        "Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getAxiosConfigJSON = () => {
    return {
      headers: {
        "Content-Type": "application/json", // Para indicar que el body es un JSON
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    obtenerTramites();
  }, [auth]); // Escucha cambios dependiendo de la autenticacion, y del token
  // }, [auth, token]); // Escucha cambios dependiendo de la autenticacion, y del token

  const obtenerTramites = async () => {
    if (!token) return; // Si no hay token, no se hace la petición

    try {
      const { data } = await clienteAxios.get("/tramites", getAxiosConfig());

      // console.log(data);
      setTramites(data); // Actualizar el state con los tramites obtenidos, para que sea visible en la aplicación
    } catch (error) {
      console.error(error.response?.data?.mensaje);
    }
  };

  const guardarTramite = async (tramite) => {
    if (!token) {
      console.log("No hay token disponible, no se puede guardar el trámite.");
      return { message: "No hay token disponible", error: true };
    }

    try {
      const formData = new FormData();
      formData.append("oficioRemitente", tramite.oficioRemitente);
      formData.append("asunto", tramite.asunto);
      formData.append("referenciaTramite", tramite.referenciaTramite);
      formData.append("fechaDocumento", tramite.fechaDocumento);
      formData.append(
        "departamentoRemitenteId",
        tramite.departamentoRemitenteId
      );
      formData.append("remitenteId", tramite.remitenteId);
      formData.append("prioridad", tramite.prioridad);
      formData.append("descripcion", tramite.descripcion);
      formData.append("tramiteExterno", tramite.tramiteExterno);

      // Adjuntar archivos al FormData
      if (tramite.archivos && tramite.archivos.length > 0) {
        tramite.archivos.forEach((archivo) => {
          formData.append("archivos", archivo);
        });
      }

      if (tramite.archivosEliminar) {
        formData.append(
          "archivosEliminar",
          JSON.stringify(tramite.archivosEliminar)
        );
      }

      // Si el tramite tiene un id, entonces es una edición
      if (tramite.id) {
        const { data } = await clienteAxios.put(
          `/tramites/${tramite.id}`,
          formData,
          getAxiosConfig()
        );

        console.log(data);

        const tramitesActualizado = tramites.map((tramiteState) =>
          tramiteState.id === data.id ? data : tramiteState
        );

        setTramites(tramitesActualizado);

        // Opcional por la referencia de tramites en departamento o
        obtenerTramites();

        return { message: data.message, error: false, tramiteId: data.data.id };
      } else {
        const { data } = await clienteAxios.post(
          "/tramites",
          formData,
          getAxiosConfig()
        );

        // Va a crear un nuevo objeto con lo que no necesitamos
        const {
          activo,
          createdAt,
          usuario_actualizacion,
          usuario_creacion,
          ...tramiteAlmacenado
        } = data.data;

        // Actualizar el state tomando lo que hay en tramites y agregando el nuevo objecto de tramite almacenado
        setTramites([tramiteAlmacenado, ...tramites]);

        // Retornar el mensaje de respuesta
        return { message: data.message, error: false };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error inesperado";
      console.error(errorMessage);
      return { message: errorMessage, error: true };
    }
  };

  const setEdicion = (tramite) => {
    // console.log(tramite);
    setTramite(tramite);
  };

  const eliminarTramite = async (id) => {
    const confirmar = confirm("¿Confirmas que deseas eliminar?");
    console.log(confirmar);
    if (confirmar) {
      try {
        const { data } = await clienteAxios.delete(
          `/tramites/${id}`,
          getAxiosConfig()
        );

        console.log(data);

        const tramitesActualizado = tramites.filter(
          (tramitesState) => tramitesState.id !== id
        );

        setTramites(tramitesActualizado);
      } catch (error) {
        console.log(error.response?.data?.menssage);
      }
    }
  };

  const buscarTramites = async (filtros) => {
    try {
      const config = getAxiosConfigJSON();
      const { data } = await clienteAxios.get(
        "/tramites/buscar",
        { params: filtros, ...config } // params debe estar en un objeto separado, y se envia la configuracion como una llamada
        // ** El operador ...config descompone el objeto config y lo combina con los otros parámetros (params: filtros).
      );

      // console.log(data);
      setTramitesRespuesta(data);
      console.log("🚀 tramitesRespuesta actualizado:", tramitesRespuesta);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error al buscar trámites"
      );
    }
  };

  /*
  const handleRefrescar = () => {
    setActualizar(!actualizar);
  };
*/

  return (
    // Value: indicamos que va a ser un objeto que sera disponible y le pasamos el estado tramites
    <TramitesContext.Provider
      value={{
        tramites,
        guardarTramite,
        setEdicion,
        tramite,
        eliminarTramite,
        buscarTramites,
        tramitesRespuesta,
        setTramitesRespuesta,
      }}
    >
      {children}
    </TramitesContext.Provider>
  );
};

export default TramitesContext;
