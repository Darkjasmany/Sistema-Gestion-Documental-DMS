import React, { useEffect, useState, useRef, slice } from "react";
import Alerta from "../components/Alerta.components";
import clienteAxios from "../config/axios.config";
import useTramites from "../hooks/useTramites.hook";

const DespacharTramite = ({ tramite, onTramiteUpdated, closeModal }) => {
  const [alerta, setAlerta] = useState({});
  const [fechaDespacho, setFechaDespacho] = useState("");
  const [horaDespacho, setHoraDespacho] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [archivosEliminar, setArchivosEliminar] = useState([]);
  const fileInputArchivos = useRef(null); // Referencia al input file
  const [id, setId] = useState(null);
  const [parametros, setParametros] = useState([]);
  const [maxUploadFiles, setMaxUploadFiles] = useState(null);

  const { finalizarDespacho, tramitesDespachador } = useTramites();

  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const { data } = await clienteAxios("/admin/parametros");
        setParametros(data);

        const maxFiles = data.find(
          (parametro) => parametro.clave === "MAX_UPLOAD_FILES"
        );

        setMaxUploadFiles(Number(maxFiles?.valor || 0));
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };
    fetchParametros();
  }, []);

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  useEffect(() => {
    console.log(tramite);
    setFechaDespacho(tramite.fecha_despacho);

    if (tramite.estado === "DESPACHADO") {
      const horaDespachoFormateada = tramite.hora_despacho
        ? tramite.hora_despacho.slice(0, 5) // Corta "HH:MM:SS" a "HH:MM"
        : "";

      setHoraDespacho(horaDespachoFormateada);

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

  const handleSubmitDespachar = async (e) => {
    e.preventDefault();
    if ([fechaDespacho, horaDespacho].includes("")) {
      setAlerta({ message: "Todos los campos son Obligatorios", error: true });
      return;
    }

    if (archivos.length === 0) {
      setAlerta({
        message: "Debes seleccionar al menos un archivo",
        error: true,
      });
      return;
    }

    const datosFinalizar = {
      fechaDespacho,
      horaDespacho,
      archivos,
      archivosEliminar,
      id,
    };
    try {
      let response;

      if (tramite.estado === "DESPACHADO") {
        // response = await actualizarCompletarTramiteCoordinador(
        //   tramite.id,
        //   datosCompletar
        // );
      } else {
        response = await finalizarDespacho(tramite.id, datosFinalizar);
        // return;
      }

      setAlerta({ message: response.message, error: response.error });

      if (!response.error) {
        setTimeout(() => {
          closeModal();
          onTramiteUpdated();
        }, 2000);
      }
    } catch (error) {
      setAlerta({ message: error, error: true });
      console.error(error.message);
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
    setArchivos([...archivos, ...archivosSeleccionados]); // Agregar los nuevos
  };

  const eliminarArchivo = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
    setArchivosEliminar(...archivosEliminar, archivos[index].id);

    // Reiniciar el input file si no quedan archivos
    if (nuevosArchivos.length === 0) {
      fileInputArchivos.current.value = ""; //Reinicia el input type file
    }
  };

  return (
    <div>
      <form
        action=""
        className="my-5 py-4 px-10 shadow-md rounded-md border"
        onSubmit={handleSubmitDespachar}
      >
        {alerta.message && <Alerta alerta={alerta} />}

        <div className="flex justify-between gap-5">
          {/* Campo para la Fecha Despacho*/}
          <div className="mb-5 w-full">
            <label className="text-gray-700 font-medium block">
              Fecha Despacho:
            </label>
            <input
              type="date"
              value={fechaDespacho}
              onChange={(e) => setFechaDespacho(e.target.value)}
              className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Campo para la Hora Despacho*/}
          <div className="mb-5 w-full">
            <label className="text-gray-700 font-medium block">
              Hora Despacho:
            </label>
            <input
              type="time"
              value={horaDespacho}
              onChange={(e) => setHoraDespacho(e.target.value)}
              className="border-2 w-full h-10 p-2 mt-2 rounded-md"
              step="300" // Saltos de 5 minutos
            />
          </div>
        </div>

        {/* Campo para cargar Archivos */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium block">
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

        {/* Botones */}
        <div className="text-right flex gap-2 justify-end">
          {/* <button
            type="button"
            onClick={handleEditar}
            className="bg-red-600 text-white px-5 py-2 rounded-md uppercase font-bold hover:bg-red-800 cursor-pointer transition-colors"
          >
            Editar
          </button> */}

          <input
            type="submit"
            value={id ? "Guardar Cambios" : "Finalizar"}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
          />
        </div>

        {/* Mostrar archivos seleccionados*/}
        {archivos.length > 0 && (
          <div className="mb-5">
            <h3 className="text-lg font-bold mb-3">
              {id ? "Archivos cargados" : "Archivos seleccionados"}
            </h3>
            <ul>
              {archivos.map((archivo, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 select-none "
                >
                  <a
                    href={archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
      </form>
    </div>
  );
};

export default DespacharTramite;
