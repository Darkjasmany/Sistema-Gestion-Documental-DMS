import { useState, useEffect, useRef } from "react";
import clienteAxios from "../config/axios.config";
import Alerta from "../components/Alerta.components";
import useTramites from "../hooks/useTramites.hook";

const Formulario = () => {
  const [asunto, setAsunto] = useState("");
  const [referenciaTramite, setReferenciaTramite] = useState("");
  const [fechaDocumento, setFechaDocumento] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [departamentoRemitenteId, setDepartamentoRemitenteId] = useState("");
  const [remitenteId, setRemitenteId] = useState("");
  const [prioridad, setPrioridad] = useState("NORMAL");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [tramiteExterno, setTramiteExterno] = useState(false);

  const [departamentos, setDepartamentos] = useState([]);
  const [remitentes, setRemitentes] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [maxUploadFiles, setMaxUploadFiles] = useState(null);

  const [id, setId] = useState(null);

  const [alerta, setAlerta] = useState({});

  const fileInputArchivos = useRef(null); // Referencia al input file

  const { guardarTramite, tramite } = useTramites(); // Extraemos lo que tenemos en el TramiteProvider

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const { data } = await clienteAxios("/departamentos");
        setDepartamentos(data);
      } catch (error) {
        console.lo(error.response?.data?.message);
      }
    };

    const fecthParametros = async () => {
      try {
        const { data } = await clienteAxios("/admin/parametros");
        setParametros(data);

        // Buscar el valor MAX-UPLOAD_FILES
        const parametroMaxUploadFiles = data.find(
          (parametro) => parametro.clave === "MAX_UPLOAD_FILES"
        );

        if (parametroMaxUploadFiles) {
          setMaxUploadFiles(Number(parametroMaxUploadFiles));
        } else {
          setAlerta({
            message: "No se encontro el parametro MAX_UPLOAD_FILES",
            error: true,
          });
        }
      } catch (error) {
        console.error(
          "Error al cargar parámetros:",
          error.response?.data?.message
        );
        setAlerta({
          message: "Error al obtener los parámetros. Intenta nuevamente.",
          error: true,
        });
      }
    };

    fetchDepartamentos();
    fecthParametros();
  }, []);

  useEffect(() => {
    //** CARGAR DATOS PARA ACTUALIZAR TRÁMITE */
    if (tramite?.asunto) {
      setAsunto(tramite.asunto);
      setReferenciaTramite(tramite.referencia_tramite);
      setFechaDocumento(tramite.fecha_documento);
      setDepartamentoRemitenteId(tramite.departamentoRemitente?.id || "");

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
      if (tramite.tramiteArchivos?.length > 0) {
        const rutasArchivos = tramite.tramiteArchivos.map((archivo) => ({
          id: archivo.id,
          name: archivo.original_name,
          url: `${import.meta.env.VITE_BACKEND_URL}/${archivo.ruta}`,
        }));
        setArchivos(rutasArchivos);
      }

      setId(tramite.id);
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
  };

  // Funcion para eliminar archivo
  const eliminarArchivo = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);

    // Reiniciar el input file si no quedan archivos
    if (nuevosArchivos.length === 0) {
      fileInputArchivos.current.value = ""; // Reinicia el input file
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      [
        asunto,
        descripcion,
        departamentoRemitenteId,
        remitenteId,
        fechaDocumento,
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

    // console.log(archivos);

    setAlerta({});

    // Llamamos a la function guardarTramite del useTramites
    guardarTramite({
      asunto,
      referenciaTramite,
      fechaDocumento,
      departamentoRemitenteId,
      remitenteId,
      prioridad,
      descripcion,
      tramiteExterno,
      archivos,
      id,
    });
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
        {/* Campo para el Asunto */}
        <div className="mb-5">
          <label htmlFor="asunto" className="text-gray-700 uppercase font-bold">
            Asunto
          </label>
          <input
            type="text"
            id="asunto"
            value={asunto}
            onChange={(e) => {
              setAsunto(e.target.value);
            }}
            placeholder="Ingresa el asunto del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para la Referencia */}
        <div className="mb-5">
          <label
            htmlFor="referenciaTramite"
            className="text-gray-700 uppercase font-bold"
          >
            Referencia
          </label>
          <input
            type="text"
            id="referenciaTramite"
            value={referenciaTramite}
            onChange={(e) => {
              setReferenciaTramite(e.target.value);
            }}
            placeholder="Ingresa la referencia del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para la Fecha */}
        <div className="mb-5">
          <label
            htmlFor="fechaDocumento"
            className="text-gray-700 uppercase font-bold"
          >
            Fecha del Trámite
          </label>
          <input
            type="date"
            id="fechaDocumento"
            value={fechaDocumento}
            onChange={(e) => {
              setFechaDocumento(e.target.value);
            }}
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para seleccionar Departamento */}
        <div className="mb-5">
          <label
            htmlFor="departamentoRemitenteId"
            className="text-gray-700 uppercase font-bold"
          >
            Departamento Remitente
          </label>
          <select
            name="departamentoRemitenteId"
            id="departamentoRemitenteId"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
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
          <label
            htmlFor="remitenteId"
            className="text-gray-700 uppercase font-bold"
          >
            Remitente
          </label>
          <select
            name="remitenteId"
            id="remitenteId"
            value={remitenteId}
            onChange={(e) => {
              setRemitenteId(e.target.value);
            }}
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
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
          <label
            htmlFor="prioridad"
            className="text-gray-700 uppercase font-bold"
          >
            Prioridad
          </label>
          <select
            name="prioridad"
            id="prioridad"
            value={prioridad}
            onChange={(e) => {
              setPrioridad(e.target.value);
            }}
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          >
            <option value="NORMAL">NORMAL</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>

        {/* Campo para la Descripción */}
        <div className="mb-5">
          <label
            htmlFor="descripcion"
            className="text-gray-700 uppercase font-bold"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
            }}
            placeholder="Ingresa la descripción del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para cargar Archivos */}
        <div className="mb-5">
          <label
            htmlFor="archivo"
            className="text-gray-700 uppercase font-bold"
          >
            Cargar Archivos
          </label>
          <input
            type="file"
            id="archivo"
            accept=".jpg,.png,.zip,.rar,.pdf"
            multiple
            ref={fileInputArchivos} // Referencia al input
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            onChange={handleArchivosSeleccionados}
          />
        </div>

        {/* Checkbox para Trámite Externo */}
        <div className="flex items-start mb-5 select-none">
          <div className="flex items-center h-5">
            <input
              id="tramiteExterno"
              type="checkbox"
              value={tramiteExterno}
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

        <input
          type="submit"
          value={id ? "Guardar Cambios" : "Crear Trámite"}
          className="bg-indigo-600 text-white w-full p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
        />
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
