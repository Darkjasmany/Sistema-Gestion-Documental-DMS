import { useState, useEffect, useRef } from "react";
import clienteAxios from "../config/axios.config";
import Alerta from "../components/Alerta.components";
import useTramites from "../hooks/useTramites.hook";

const Formulario = () => {
  const [asunto, setAsunto] = useState("");
  const [referenciaTramite, setReferenciaTramite] = useState("");
  const [oficioRemitente, setOficioRemitente] = useState("");
  const [fechaDocumento, setFechaDocumento] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [departamentoRemitenteId, setDepartamentoRemitenteId] = useState("");
  const [remitenteId, setRemitenteId] = useState("");
  const [prioridad, setPrioridad] = useState("NORMAL");
  const [descripcion, setDescripcion] = useState("");
  const [tramiteExterno, setTramiteExterno] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [archivosEliminar, setArchivosEliminar] = useState([]);
  // const [archivosNuevos, setArchivosNuevos] = useState([]);

  const [tramiteReferencia, setTramiteReferencia] = useState(false);

  const [departamentos, setDepartamentos] = useState([]);
  const [remitentes, setRemitentes] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [maxUploadFiles, setMaxUploadFiles] = useState(null);

  const [id, setId] = useState(null);

  const [alerta, setAlerta] = useState({});

  const fileInputArchivos = useRef(null); // Referencia al input file

  const { guardarTramite, tramite, setTramitesRespuesta, setTramite } =
    useTramites(); // TODO Extraemos lo que tenemos en el TramiteProvider

  useEffect(() => {
    // ** Cargar Departamentos y Parámetros
    const fecthData = async () => {
      try {
        const [departamentos, parametros] = await Promise.all([
          clienteAxios("/departamentos"),
          clienteAxios("/admin/parametros"),
        ]);

        setDepartamentos(departamentos.data);
        setParametros(parametros.data);

        const maxFiles = parametros.data.find(
          (parametro) => parametro.clave === "MAX_UPLOAD_FILES"
        );

        setMaxUploadFiles(Number(maxFiles?.valor || 0));
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fecthData();
    // setTramite({}); // Limpiar el estado del trámite al montar el formulario
    setTramitesRespuesta([]); // Limpiar el estado de los trámites de la consulta
  }, []);

  // ** UseEffect para Alerta
  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000); // Limpia la alerta después de 3s
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  //** CARGAR DATOS PARA ACTUALIZAR TRÁMITE */
  useEffect(() => {
    if (tramite?.asunto && tramite.tramiteArchivos?.length > 0) {
      // console.log(tramite);
      setOficioRemitente(tramite.numero_oficio_remitente);
      setAsunto(tramite.asunto);

      if (tramite.referencia_tramite) {
        setReferenciaTramite(tramite.referencia_tramite);
        setTramiteReferencia(true);
      } else {
        setReferenciaTramite("");
        setTramiteReferencia(false);
      }

      setFechaDocumento(tramite.fecha_documento);
      setDepartamentoRemitenteId(tramite.departamentoRemitente?.id);

      const cargarRemitentes = async () => {
        if (tramite.departamentoRemitente?.id) {
          try {
            const { data } = await clienteAxios(
              `/empleados/por-departamento/${tramite.departamentoRemitente?.id}`
            );

            setRemitentes(data);
          } catch (error) {
            console.error(error.response?.data?.message);
            setRemitentes([]); // Limpia la lista en caso de error
          }
        }
      };

      cargarRemitentes().then(() => {
        // Después de cargar los remitentes, asignar el remitenteId
        setRemitenteId(tramite.remitente?.id || "");
      });

      setPrioridad(tramite.prioridad);
      setDescripcion(tramite.descripcion);
      setTramiteExterno(tramite.externo);

      // Generar URLs completas para los archivos existentes

      setTimeout(() => {
        const rutasArchivos = tramite.tramiteArchivos.map((archivo) => ({
          id: archivo.id,
          name: archivo.original_name,
          url: `${import.meta.env.VITE_BACKEND_URL}/${archivo.ruta}`,
        }));
        setArchivos(rutasArchivos);
      }, 100); // Retrasar un poco la carga de archivos

      setId(tramite.id);
    }
  }, [tramite]);

  // ** Restablecer el formulario al desmostar el componente
  useEffect(() => {
    // return () => {
    if (!tramite?.id) {
      setId(null);
      setOficioRemitente("");
      setAsunto("");
      setTramiteReferencia(false);
      setReferenciaTramite("");
      setFechaDocumento(new Date().toISOString().split("T")[0]);
      setDepartamentoRemitenteId("");
      setRemitenteId("");
      setPrioridad("NORMAL");
      setDescripcion("");
      setArchivos([]);
      setTramiteExterno(false);
      fileInputArchivos.current.value = ""; // Limpiar el input de archivos
    }
  }, [tramite]);

  // Mostrar empleados de acuerdo al departamento seleccionado
  const handleDepartamentoChange = async (e) => {
    const departamentoId = e.target.value;
    setDepartamentoRemitenteId(departamentoId);

    if (!departamentoId) {
      setRemitentes([]); // Limpia la lista si no hay un departamento seleccionado
      setDepartamentoRemitenteId([]);
      return;
    }

    try {
      const { data } = await clienteAxios(
        `/empleados/por-departamento/${departamentoId}`
      );

      setRemitentes(data);
    } catch (error) {
      console.error(error.response?.data?.message);
      setRemitentes([]); // Limpia la lista en caso de error
    }
  };

  const handleArchivosSeleccionados = (e) => {
    const archivosSeleccionados = Array.from(e.target.files); // Convertimos FileList a un array

    // Verificamos si los archivos seleccionados y los ya cargados exceden el máximo
    if (archivosSeleccionados.length + archivos.length > maxUploadFiles) {
      e.target.value = ""; // Limpiar el input de archivos
      setAlerta({
        message: `Solo puedes subir hasta ${maxUploadFiles} archivo(s).`,
        error: true,
      });
      return;
    }

    setAlerta({});
    setArchivos([...archivos, ...archivosSeleccionados]); // Agregar los nuevos archivos al estado
    // setArchivos([...archivos]); // Agregar los nuevos archivos al estado
    // setArchivosNuevos([...archivosSeleccionados]); // Agregar los nuevos archivos al estado
  };

  // Funcion para eliminar archivo
  const eliminarArchivo = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
    setArchivosEliminar([...archivosEliminar, archivos[index].id]);

    // Reiniciar el input file si no quedan archivos
    if (nuevosArchivos.length === 0) {
      fileInputArchivos.current.value = ""; // Reinicia el input file
    }
  };

  const handleLimpiarFormulario = () => {
    setId(null);
    setOficioRemitente("");
    setAsunto("");
    setTramiteReferencia(false);
    setReferenciaTramite("");
    setFechaDocumento(new Date().toISOString().split("T")[0]);
    setDepartamentoRemitenteId("");
    setRemitenteId("");
    setPrioridad("NORMAL");
    setDescripcion("");
    setArchivos([]);
    setTramiteExterno(false);
    fileInputArchivos.current.value = "";
    setAlerta({});
    setTramite({}); // Limpiamos el estado del trámite en el Provider
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      [
        oficioRemitente,
        asunto,
        fechaDocumento,
        departamentoRemitenteId,
        remitenteId,
        descripcion,
      ].includes("")
    ) {
      return setAlerta({
        message: "Todos los campos son obligatorios",
        error: true,
      });
    }

    if (archivos.length === 0) {
      return setAlerta({
        message: "Debes seleccionar al menos un archivo",
        error: true,
      });
    }

    // ** Llamamos  a la function guardarTramite del useTramites

    try {
      const response = await guardarTramite({
        oficioRemitente,
        asunto,
        referenciaTramite,
        fechaDocumento,
        departamentoRemitenteId,
        remitenteId,
        prioridad,
        descripcion,
        tramiteExterno,
        archivos,
        // archivosNuevos,
        archivosEliminar,
        id, // El id se pasa para la edición
      });

      if (response.error) {
        setAlerta({ message: response.message, error: true });
      } else {
        setAlerta({ message: response.message, error: false });
        // console.log("Valor de id antes del if (!id):", id);

        // Crea ID is null
        // Limpiar el formulario SOLO si la creación o actualización fue exitosa
        if (!id || response.tramiteId) {
          setOficioRemitente("");
          setAsunto("");
          setTramiteReferencia(false);
          setReferenciaTramite("");
          setFechaDocumento(new Date().toISOString().split("T")[0]);
          setDepartamentoRemitenteId("");
          setRemitenteId("");
          setPrioridad("NORMAL");
          setDescripcion("");
          setArchivos([]);
          setTramiteExterno(false);
          fileInputArchivos.current.value = ""; // Limpiar el input de archivos
        }
      }
    } catch (error) {
      // Mostrar el error sin borrar el formulario
      setAlerta({ message: error, error: true });
      console.error(error.message); // Mostrar el error en la consola también
    }
  };

  const { message } = alerta;

  return (
    <>
      <h2 className="font-black text-3xl text-center">
        Administrador de Trámites
      </h2>

      <p className="text-xl mt-5 mb-10 text-center">
        Añade tus trámites y{" "}
        <span className="text-indigo-600 font-bold">Administralos</span>{" "}
      </p>

      <form
        action=""
        onSubmit={handleSubmit}
        className="bg-white py-10 px-5 mb-10 lg:mb-0 shadow-md rounded-md"
      >
        {message && <Alerta alerta={alerta} />}

        {/* Campo para el OficioRemitente */}
        <div className="mb-5">
          <label
            htmlFor="oficioRemitente"
            className="text-gray-700 font-medium"
          >
            Número Oficio|Memo:
          </label>
          <input
            type="text"
            id="oficioRemitente"
            value={oficioRemitente}
            onChange={(e) => {
              setOficioRemitente(e.target.value);
            }}
            placeholder="Ingresa el número de oficio del Trámite"
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Campo para el Asunto */}
        <div className="mb-5">
          <label htmlFor="asunto" className="text-gray-700 font-medium">
            Asunto del Trámite:
          </label>
          <input
            type="text"
            id="asunto"
            value={asunto}
            onChange={(e) => {
              setAsunto(e.target.value);
            }}
            placeholder="Ingresa el asunto del Trámite"
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Checkbox para Referencia Trámite */}
        <div className="flex items-start mb-5 select-none">
          <div className="flex items-center h-5">
            <input
              id="tramiteReferencia"
              type="checkbox"
              checked={tramiteReferencia} // Sincroniza el estado con el valor del checkbox
              onChange={(e) => {
                setTramiteReferencia(e.target.checked);
              }}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 "
              aria-label="Trámite Referencia"
            />
          </div>
          <label
            htmlFor="tramiteReferencia"
            className="ms-2 text-sm font-medium text-gray-900 select-none"
          >
            Referencia Trámite
          </label>
        </div>

        {/* Campo para la Referencia */}
        <div className="mb-5" hidden={!tramiteReferencia}>
          <label
            htmlFor="referenciaTramite"
            className="text-gray-700 font-medium"
          >
            Referencia Trámite:
          </label>
          <input
            type="text"
            id="referenciaTramite"
            value={referenciaTramite}
            onChange={(e) => {
              setReferenciaTramite(e.target.value);
            }}
            placeholder="Ingresa la referencia del Trámite"
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Campo para la Fecha */}
        <div className="mb-5">
          <label htmlFor="fechaDocumento" className="text-gray-700 font-medium">
            Fecha del Trámite:
          </label>
          <input
            type="date"
            id="fechaDocumento"
            value={fechaDocumento}
            onChange={(e) => {
              setFechaDocumento(e.target.value);
            }}
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Campo para seleccionar Departamento */}
        <div className="mb-5">
          <label
            htmlFor="departamentoRemitenteId"
            className="text-gray-700 font-medium"
          >
            Departamento Remitente:
          </label>
          <select
            name="departamentoRemitenteId"
            id="departamentoRemitenteId"
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={departamentoRemitenteId}
            onChange={handleDepartamentoChange}
          >
            <option value={""}>Seleccione un departamento</option>
            {departamentos.map((departamento) => (
              <option value={departamento.id} key={departamento.id}>
                {departamento.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para seleccionar Remitente */}
        <div className="mb-5">
          <label htmlFor="remitenteId" className="text-gray-700 font-medium">
            Remitente:
          </label>
          <select
            name="remitenteId"
            id="remitenteId"
            value={remitenteId}
            onChange={(e) => {
              setRemitenteId(e.target.value);
            }}
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option
              onChange={(e) => {
                setRemitenteId(e.target.value);
              }}
            >
              Seleccione un remitente
            </option>

            {remitentes.map((remitente) => (
              <option value={remitente.id} key={remitente.id}>
                {remitente.nombres} {remitente.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para seleccionar Prioridad */}
        <div className="mb-5">
          <label htmlFor="prioridad" className="text-gray-700 font-medium">
            Prioridad:
          </label>
          <select
            name="prioridad"
            id="prioridad"
            value={prioridad}
            onChange={(e) => {
              setPrioridad(e.target.value);
            }}
            className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="NORMAL">NORMAL</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>

        {/* Campo para la Descripción */}
        <div className="mb-5">
          <label htmlFor="descripcion" className="text-gray-700 font-medium">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
            }}
            placeholder="Ingresa la descripción del Trámite"
            className="border-2 w-full p-2 mt-2 h-11 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Campo para cargar Archivos */}
        <div className="mb-5">
          <label htmlFor="archivo" className="text-gray-700 font-medium">
            Cargar Archivos:
          </label>
          <input
            type="file"
            id="archivo"
            accept=".jpg,.png,.zip,.rar,.pdf"
            multiple
            ref={fileInputArchivos} // Referencia al input
            className="border-2 w-full h-12 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleArchivosSeleccionados}
          />
        </div>

        {/* Checkbox para Trámite Externo */}
        <div className="flex items-start mb-5 select-none">
          <div className="flex items-center h-5">
            <input
              id="tramiteExterno"
              type="checkbox"
              // value={tramiteExterno}
              checked={tramiteExterno} // Sincroniza el estado con el valor del checkbox
              onChange={(e) => {
                setTramiteExterno(e.target.checked);
              }}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 "
              aria-label="Trámite Externo"
            />
          </div>
          <label
            htmlFor="tramiteExterno"
            className="ms-2 text-sm font-medium text-gray-900 select-none"
          >
            Trámite Externo
          </label>
        </div>

        {/* <input
          type="submit"
          value={id ? "Guardar Cambios" : "Crear Trámite"}
          className="bg-indigo-600 text-white w-full p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
        /> */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleLimpiarFormulario}
            className="bg-gray-300 text-gray-700 w-1/2 p-3 uppercase font-bold hover:bg-gray-400 cursor-pointer transition-colors mr-2"
          >
            Limpiar Formulario
          </button>
          <input
            type="submit"
            value={id ? "Guardar Cambios" : "Crear Trámite"}
            className="bg-indigo-600 text-white w-1/2 p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
          />
        </div>
      </form>

      {/* Mostrar archivos seleccionados */}
      {archivos.length > 0 && (
        <div className="mt-5">
          <h3 className="text-lg font-bold mb-3">
            {id ? "Archivos cargados" : "Archivos seleccionados"}
          </h3>
          <ul>
            {archivos.map((archivo, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 select-none"
              >
                {/* {archivo.name ? archivo.name : archivo.url.split("/").pop()}
                <button
                  onClick={() => eliminarArchivo(index)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  x
                </button> */}

                <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                  {archivo.name ? archivo.name : archivo.url.split("/").pop()}
                </a>
                <button
                  onClick={() => eliminarArchivo(index)}
                  className="text-red-600 hover:text-red-800 font-extrabold"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Formulario;
