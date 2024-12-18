import { useState, useEffect, useRef } from "react";
import clienteAxios from "../config/axios.config";
import Alerta from "../components/Alerta.components";

const Formulario = () => {
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [departamentoRemitenteId, setDepartamentoRemitenteId] = useState("");
  const [remitenteId, setRemitenteId] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [fechaDocumento, setFechaDocumento] = useState("");
  const [referenciaTramite, setReferenciaTramite] = useState("");
  const [tramiteExterno, setTramiteExterno] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [remitentes, setRemitentes] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [maxUploadFiles, setMaxUploadFiles] = useState(null);
  const [alerta, setAlerta] = useState({});

  const fileInputArchivos = useRef(null); // Referencia al input file

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

  // Mostrar empleados de acuerdo al departamento seleccionado
  const handleDepartamentoChange = async (e) => {
    const departamentoId = e.target.value;

    if (!departamentoId) {
      return setRemitentes([]); // Limpia la lista si no hay un departamento seleccionado
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
  };

  const { message } = alerta;
  return (
    <>
      <p className="text-lg text-center mb-10 select-none ">
        Añade tus trámites y{" "}
        <span className="text-indigo-600 font-bold">Administralos</span>
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
            onChange={handleDepartamentoChange}
          >
            <option
              value={departamentoRemitenteId}
              onChange={(e) => {
                setDepartamentoRemitenteId(e.target.value);
              }}
            >
              Seleccione un departamento
            </option>
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
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          >
            <option
              value={remitenteId}
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
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          >
            <option value="NORMAL" defaultChecked>
              NORMAL
            </option>
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
            accept=".jpg,.png,.zip,.rar"
            multiple
            ref={fileInputArchivos} // Referencia al input
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            onChange={handleArchivosSeleccionados}
          />
        </div>

        {/* Checkbox para Trámite Externo */}
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="tramiteExterno"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
              aria-label="Trámite Externo"
            />
          </div>
          <label
            htmlFor="tramiteExterno"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            Trámite Externo
          </label>
        </div>

        <input
          type="submit"
          value={"Agregar Trámite"}
          className="bg-indigo-600 text-white w-full p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
        />
      </form>

      {/* Mostrar archivos seleccionados */}
      {archivos.length > 0 && (
        <div className="mt-5">
          <h3 className="text-lg font-bold mb-3">Archivos seleccionados:</h3>
          <ul>
            {archivos.map((archivo, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 select-none"
              >
                {archivo.name}
                <button
                  onClick={() => eliminarArchivo(index)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  x
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
