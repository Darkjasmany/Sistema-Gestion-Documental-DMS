import useTramites from "../../../hooks/useTramites.hook";

// Destructuramos el tramite que nos llega como prop siendo un objeto
const Tramite = ({ tramite }) => {
  // console.log(tramite);
  const { setEdicion, eliminarTramite } = useTramites();

  const {
    id,
    numero_tramite,
    numero_oficio_remitente,
    asunto,
    referencia_tramite,
    fecha_documento,
    prioridad,
    descripcion,
    externo,
    createdAt,
    departamentoRemitente,
    remitente,
    tramiteArchivos,
  } = tramite;

  // Formatear fechas
  // Aqui usamos una api de JS para formatear la fecha sin modificar el formato de la fecha en la base de datos
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(`${fecha}T00:00`); // Convierte la fecha a un objeto Date Sin la "Z" (evitamos UTC)
    return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
      nuevaFecha
    );
  };

  const nombreDepartamento = departamentoRemitente?.nombre || "No especificado";
  const nombreRemitente = remitente?.nombreCompleto || "No especificado";

  // console.log(tramite);

  return (
    <>
      <div className="mx-5 my-10 bg-white shadow-md p-5 py-10 rounded-xl">
        <p className="font-bold uppercase text-indigo-700 my-2">
          Número de Trámite:{" "}
          <span className="font-normal normal-case text-black">
            {numero_tramite}
          </span>
        </p>

        <p className="font-bold uppercase text-indigo-700 my-2">
          Número Oficio|Memo:{" "}
          <span className="font-normal normal-case text-black">
            {numero_oficio_remitente}
          </span>
        </p>

        <p className="font-bold uppercase text-indigo-700 my-2">
          Asunto:{" "}
          <span className="font-normal normal-case text-black">{asunto}</span>
        </p>

        {referencia_tramite ? (
          <p className="font-bold uppercase text-indigo-700 my-2">
            Referencia:{" "}
            <span className="font-normal normal-case text-black">
              {referencia_tramite}
            </span>
          </p>
        ) : null}

        <p className="font-bold uppercase text-indigo-700 my-2">
          Fecha del Trámite:{" "}
          <span className="font-normal normal-case text-black">
            {formatearFecha(fecha_documento)}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Departamento Remitente:{" "}
          <span className="font-normal normal-case text-black">
            {nombreDepartamento}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Remitente:{" "}
          <span className="font-normal normal-case text-black">
            {nombreRemitente}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Prioridad:{" "}
          <span className="font-normal normal-case text-black">
            {prioridad}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Descripción:{" "}
          <span className="font-normal normal-case text-black">
            {descripcion}
          </span>
        </p>
        {externo ? (
          <p className="font-bold uppercase text-indigo-700 my-2">
            Trámite Externo:{" "}
            <span className="font-normal uppercase text-black ">Si</span>
          </p>
        ) : null}
        <p className="font-bold uppercase text-indigo-700 my-2">Archivos:</p>
        <ul className="list-disc pl-5">
          {tramiteArchivos?.length > 0 ? (
            tramiteArchivos.map((archivo) => (
              <li key={archivo.id}>
                <a
                  href={import.meta.env.VITE_BACKEND_URL + "/" + archivo.ruta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {archivo.original_name}
                </a>
              </li>
            ))
          ) : (
            <li>No hay archivos adjuntos</li>
          )}
        </ul>

        <div className="flex justify-between my-5">
          <button
            type="button"
            className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold rounded-lg"
            onClick={() => {
              setEdicion(tramite);
            }}
          >
            Editar
          </button>
          <button
            // disabled
            type="button"
            className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white uppercase font-bold rounded-lg"
            // className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white uppercase font-bold rounded-lg opacity-50 cursor-not-allowed"
            onClick={() => {
              eliminarTramite(id);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
};

export default Tramite;
