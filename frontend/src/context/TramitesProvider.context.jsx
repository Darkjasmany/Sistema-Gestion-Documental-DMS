import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios.config";
import useAuth from "../hooks/useAuth.hook";

const TramitesContext = createContext();

// De donde vienen los datos
export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);
  const [tramite, setTramite] = useState({});
  const { auth } = useAuth();

  // Obtener el token
  const token =
    localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

  // Configuración de Axios centralizada
  const getAxiosConfig = () => {
    // ** Cuando es una petición POST, que requiere autenticación se debe enviar el token en la configuracion en el header
    return {
      headers: {
        // "Content-Type": "application/json", // Para indicar que el body es un JSON
        "Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
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
      return;
    }

    //** CREATE - UPDATE
    if (tramite.id) {
      // Actualizar un trámite existente
      try {
        console.log(tramite);
        // return;
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
        if (tramite.archivos && tramite.archivos.length > 0) {
          tramite.archivos.forEach((archivo) => {
            formData.append("archivos", archivo);
          });
        }
        /*
        // Adjuntar archivos solo si existen
        if (tramite.archivos && tramite.archivos.length > 0) {
          tramite.archivos.forEach((archivo) => {
            formData.append("archivos", archivo.id);
          });
        }
*/
        /*
        if (tramite.archivosNuevos && tramite.archivosNuevos.length > 0) {
          tramite.archivosNuevos.forEach((archivoNuevo) => {
            formData.append("archivosNuevos", archivoNuevo);
          });
        }
*/
        // formData.append(
        //   "archivosEliminar",
        //   JSON.stringify(tramite.archivosEliminar)
        // );
        if (tramite.archivosEliminar && tramite.archivosEliminar.length > 0) {
          formData.append(
            "archivosEliminar",
            JSON.stringify(tramite.archivosEliminar)
          );
        }

        const { data } = await clienteAxios.put(
          `/tramites/${tramite.id}`,
          formData,
          getAxiosConfig()
        );

        const tramitesActualizado = tramites.map((tramiteState) =>
          tramiteState.id === data.id ? data : tramiteState
        );

        setTramites(tramitesActualizado);

        obtenerTramites();
      } catch (error) {
        console.error(error.response?.data?.message);
      }
    } else {
      // **Si no tiene id, es porque es un nuevo tramite
      try {
        // console.log(tramite);
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

        const { data } = await clienteAxios.post(
          "/tramites",
          formData,
          getAxiosConfig()
        );
        // console.log(data);

        // Va a crear un nuevo objeto con lo que no necesitamos
        const {
          activo,
          createdAt,
          usuario_actualizacion,
          usuario_creacion,
          ...tramiteAlmacenado
        } = data;

        // console.log(tramiteAlmacenado);

        // Actualizar el state tomando lo que hay en tramites y agregando el nuevo tramite almacenado
        setTramites([tramiteAlmacenado, ...tramites]);

        // Recargar los tramites
        obtenerTramites();
      } catch (error) {
        console.error(error.response?.data?.message);
      }
    }
  };

  const setEdicion = (tramite) => {
    // console.log(tramite);
    setTramite(tramite);
  };
  /*
  const handleRefrescar = () => {
    setActualizar(!actualizar);
  };
*/

  return (
    // Value: indicamos que va a ser un objeto que sera disponible y le pasamos el estado tramites
    <TramitesContext.Provider
      value={{ tramites, guardarTramite, setEdicion, tramite }}
    >
      {children}
    </TramitesContext.Provider>
  );
};

export default TramitesContext;
